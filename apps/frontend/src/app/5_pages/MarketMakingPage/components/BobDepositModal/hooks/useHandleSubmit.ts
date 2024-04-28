import { MaxAllowanceTransferAmount } from '@uniswap/permit2-sdk';

import { useCallback } from 'react';

import { BigNumber, Contract, ethers } from 'ethers';
import { t } from 'i18next';

import { priceToTick } from '@sovryn/sdex';
import { CrocTokenView } from '@sovryn/sdex/dist/tokens';
import { Decimal } from '@sovryn/utils';

import {
  Transaction,
  TransactionType,
} from '../../../../../3_organisms/TransactionStepDialog/TransactionStepDialog.types';
import { useCrocContext } from '../../../../../../contexts/CrocContext';
import { useTransactionContext } from '../../../../../../contexts/TransactionContext';
import { useAccount } from '../../../../../../hooks/useAccount';
import { useCurrentChain } from '../../../../../../hooks/useChainStore';
import { translations } from '../../../../../../locales/i18n';
import { prepareApproveTransaction } from '../../../../../../utils/transactions';
import {
  createRangePositionTx,
  roundDownTick,
  roundUpTick,
} from '../../../../BobAmmPage/ambient-utils';
import { AmbientLiquidityPoolDictionary } from '../../AmbientMarketMaking/utils/AmbientLiquidityPoolDictionary';
import { useDepositContext } from '../contexts/BobDepositModalContext';
import { useGetPoolInfo } from './useGetPoolInfo';

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

export const useHandleSubmit = (assetA: string, assetB: string) => {
  const chainId = useCurrentChain();
  const { account, signer } = useAccount();
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
    usesBaseToken,
  } = useDepositContext();

  const { setTransactions, setIsOpen, setTitle } = useTransactionContext();

  const onSubmit = useCallback(async () => {
    if (!croc || !poolTokens || !signer) {
      return;
    }

    const firstAssetBigNumberAmount = Decimal.from(firstAssetValue)
      .asUnits(await poolTokens.tokenA.decimals)
      .toBigNumber();

    const secondAssetBigNumberAmount = Decimal.from(secondAssetValue)
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

    const pool = AmbientLiquidityPoolDictionary.get(assetA, assetB, chainId);

    const gridSize = (await croc.context).chain.gridSize;

    const tick = {
      low: roundDownTick(priceToTick(lowerBoundaryPrice), gridSize),
      high: roundUpTick(priceToTick(upperBoundaryPrice), gridSize),
    };

    const tx = await createRangePositionTx({
      crocEnv: croc,
      isAmbient: isBalancedRange && rangeWidth === 100,
      slippageTolerancePercentage: maximumSlippage,
      tokenA: {
        address: poolTokens.tokenA.tokenAddr,
        qty: firstAssetBigNumberAmount,
        isWithdrawFromDexChecked: false,
      },
      tokenB: {
        address: poolTokens.tokenB.tokenAddr,
        qty: secondAssetBigNumberAmount,
        isWithdrawFromDexChecked: false,
      },
      isTokenAPrimaryRange: usesBaseToken,
      tick,
      lpConduit: pool?.lpTokenAddress,
      poolIndex: pool?.poolIndex,
    });

    console.log('txData', tx);

    transactions.push({
      title: t(translations.common.deposit),
      request: {
        type: TransactionType.signTransaction,
        contract: tx.contract,
        fnName: 'userCmd',
        args: [tx.path, tx.calldata],
        value: tx.txArgs?.value ? tx.txArgs.value : 0,
        gasLimit: tx.txArgs?.gasLimit
          ? tx.txArgs.gasLimit
          : BigNumber.from(6_000_000),
      },
    });

    setTransactions(transactions);
    setTitle(t(translations.bobMarketMakingPage.depositModal.title));
    setIsOpen(true);
  }, [
    account,
    assetA,
    assetB,
    chainId,
    croc,
    firstAssetValue,
    isBalancedRange,
    lowerBoundaryPrice,
    maximumSlippage,
    poolTokens,
    rangeWidth,
    secondAssetValue,
    setIsOpen,
    setTitle,
    setTransactions,
    signer,
    upperBoundaryPrice,
    usesBaseToken,
  ]);

  return onSubmit;
};
