import { MaxAllowanceTransferAmount } from '@uniswap/permit2-sdk';

import { useCallback } from 'react';

import { BigNumber, Contract, ethers } from 'ethers';

import { CrocReposition, priceToTick } from '@sovryn/sdex';
import { CrocTokenView } from '@sovryn/sdex/dist/tokens';
import { Decimal } from '@sovryn/utils';

import { Transaction } from '../../../../../3_organisms/TransactionStepDialog/TransactionStepDialog.types';
import { useCrocContext } from '../../../../../../contexts/CrocContext';
import { useAccount } from '../../../../../../hooks/useAccount';
import { useCurrentChain } from '../../../../../../hooks/useChainStore';
import { decimalic } from '../../../../../../utils/math';
import { prepareApproveTransaction } from '../../../../../../utils/transactions';
import { AmbientPosition } from '../../AmbientMarketMaking/AmbientMarketMaking.types';
import { DEFAULT_SLIPPAGE } from '../../BobDepositModal/BobDepositModal.constants';
import { useDepositContext } from '../../BobDepositModal/contexts/BobDepositModalContext';
import { useGetPoolInfo } from '../../BobDepositModal/hooks/useGetPoolInfo';
import { mintArgsForReposition } from '../BobRepositionModal.utils';

const testAllowance = async (
  owner: string,
  token: CrocTokenView,
  amount: BigNumber,
) => {
  const allowance = await token.allowance(owner);

  if (allowance.lt(amount)) {
    const approval = await token.approve();
    return approval;
  }
};

export const useHandleSubmit = (
  assetA: string,
  assetB: string,
  position: AmbientPosition,
  onComplete: () => void,
) => {
  const chainId = useCurrentChain();
  const { account, signer } = useAccount();
  const { croc } = useCrocContext();
  const { poolTokens } = useGetPoolInfo(assetA, assetB);
  const {
    minimumPrice: lowerBoundaryPrice,
    maximumPrice: upperBoundaryPrice,
    firstAssetValue,
    secondAssetValue,
    isFirstAssetOutOfRange,
    isSecondAssetOutOfRange,
  } = useDepositContext();
  const onSubmit = useCallback(async () => {
    if (!croc || !poolTokens || !signer) {
      return;
    }

    const firstAssetBigNumberAmount = isFirstAssetOutOfRange
      ? BigNumber.from(0)
      : Decimal.from(firstAssetValue)
          .asUnits(await poolTokens.tokenA.decimals)
          .toBigNumber();

    const secondAssetBigNumberAmount = isSecondAssetOutOfRange
      ? BigNumber.from(0)
      : Decimal.from(secondAssetValue)
          .asUnits(await poolTokens.tokenB.decimals)
          .toBigNumber();

    const transactions: Transaction[] = [];

    const allowanceA = await testAllowance(
      account,
      poolTokens.tokenA,
      firstAssetBigNumberAmount,
    );
    const allowanceB = await testAllowance(
      account,
      poolTokens.tokenB,
      secondAssetBigNumberAmount,
    );

    if (allowanceA) {
      const approve = await prepareApproveTransaction({
        token: poolTokens.tokenA.tokenAddr,
        chain: chainId,
        amount:
          allowanceA.weiQty === ethers.constants.MaxUint256
            ? MaxAllowanceTransferAmount
            : allowanceA.weiQty,
        spender: allowanceA.address,
        contract: new Contract(
          poolTokens.tokenA.tokenAddr,
          (
            await poolTokens.tokenA.context
          ).erc20Write.interface,
          signer,
        ),
      });
      if (approve) {
        transactions.push(approve);
      }
    }

    if (allowanceB) {
      const approve = await prepareApproveTransaction({
        token: poolTokens.tokenB.tokenAddr,
        chain: chainId,
        amount:
          allowanceB.weiQty === ethers.constants.MaxUint256
            ? MaxAllowanceTransferAmount
            : allowanceB.weiQty,
        spender: allowanceB.address,
        contract: new Contract(
          poolTokens.tokenB.tokenAddr,
          (
            await poolTokens.tokenB.context
          ).erc20Write.interface,
          signer,
        ),
      });
      if (approve) {
        transactions.push(approve);
      }
    }

    const pool = croc.pool(position.base, position.quote, position.poolIdx);

    const repo = new CrocReposition(
      pool,
      {
        liquidity: decimalic(position.concLiq).toString(),
        burn: [position.bidTick, position.askTick],
        mint: mintArgsForReposition(
          priceToTick(lowerBoundaryPrice),
          priceToTick(upperBoundaryPrice),
        ),
      },
      { impact: DEFAULT_SLIPPAGE / 100 },
    );

    await repo.rebal();
  }, [
    account,
    chainId,
    croc,
    firstAssetValue,
    isSecondAssetOutOfRange,
    isFirstAssetOutOfRange,
    lowerBoundaryPrice,
    poolTokens,
    secondAssetValue,
    signer,
    upperBoundaryPrice,
    position,
  ]);

  return onSubmit;
};
