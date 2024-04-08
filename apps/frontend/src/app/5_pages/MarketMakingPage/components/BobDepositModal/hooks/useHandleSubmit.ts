import { useCallback } from 'react';

import { parseUnits } from 'ethers/lib/utils';

import { CrocTokenView } from '@sovryn/ambient-sdk/dist/tokens';

import { useCrocContext } from '../../../../../../contexts/CrocContext';
import { useAccount } from '../../../../../../hooks/useAccount';
import { createRangePositionTx } from '../../../../BobAmmPage/ambient-utils';
import { useDepositContext } from '../contexts/BobDepositModalContext';
import { useGetPoolInfo } from './useGetPoolInfo';

const testAllowance = async (
  owner: string,
  token: CrocTokenView,
  amount: number,
) => {
  const allowance = await token.allowance(owner);
  const decimals = await token.decimals;

  const needAllowance = parseUnits(
    (amount + 0.00001).toFixed(decimals),
    decimals,
  );

  if (allowance.lt(needAllowance)) {
    const approval = await token.approve();
    await approval?.wait();
  }
};

export const useHandleSubmit = (assetA: string, assetB: string) => {
  const { account } = useAccount();
  const { croc } = useCrocContext();
  const { poolTokens } = useGetPoolInfo(assetA, assetB);
  const {
    minimumPrice: lowerBoundaryPrice,
    maximumPrice: upperBoundaryPrice,
    firstAssetValue,
    secondAssetValue,
    maximumSlippage,
    isBalancedRange,
    rangeWidth,
  } = useDepositContext();

  const onSubmit = useCallback(async () => {
    if (!croc || !poolTokens) {
      return;
    }

    console.log(
      `lowerBoundaryPrice: ${lowerBoundaryPrice} , upperBoundaryPrice: ${upperBoundaryPrice}, firstAssetValue: ${firstAssetValue} , secondAssetValue: ${secondAssetValue}`,
    );

    await testAllowance(account, poolTokens.tokenA, Number(firstAssetValue));
    await testAllowance(account, poolTokens.tokenB, Number(secondAssetValue));

    const tx = await createRangePositionTx({
      crocEnv: croc,
      isAmbient: isBalancedRange && rangeWidth === 100,
      slippageTolerancePercentage: maximumSlippage,
      tokenA: {
        address: poolTokens.tokenA.tokenAddr,
        qty: Number(firstAssetValue),
        isWithdrawFromDexChecked: false,
      },
      tokenB: {
        address: poolTokens.tokenB.tokenAddr,
        qty: Number(secondAssetValue),
        isWithdrawFromDexChecked: false,
      },
      isTokenAPrimaryRange: true,
      tick: { low: lowerBoundaryPrice, high: upperBoundaryPrice },
    });

    console.log('tx', tx);
    console.log('tx', tx?.hash);

    const receipt = await tx?.wait();
    console.log('receipt', receipt);
  }, [
    account,
    croc,
    firstAssetValue,
    isBalancedRange,
    lowerBoundaryPrice,
    maximumSlippage,
    poolTokens,
    rangeWidth,
    secondAssetValue,
    upperBoundaryPrice,
  ]);

  return onSubmit;
};
