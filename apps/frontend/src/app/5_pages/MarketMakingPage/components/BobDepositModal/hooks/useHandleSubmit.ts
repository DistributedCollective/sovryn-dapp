import { useCallback } from 'react';

import { BigNumber } from 'ethers';
import { t } from 'i18next';

import { priceToTick } from '@sovryn/sdex';
import { Pool } from '@sovryn/sdk';
import { Decimal } from '@sovryn/utils';

import {
  Transaction,
  TransactionType,
} from '../../../../../3_organisms/TransactionStepDialog/TransactionStepDialog.types';
import { GAS_LIMIT } from '../../../../../../constants/gasLimits';
import { useCrocContext } from '../../../../../../contexts/CrocContext';
import { useTransactionContext } from '../../../../../../contexts/TransactionContext';
import { useAccount } from '../../../../../../hooks/useAccount';
import { useCurrentChain } from '../../../../../../hooks/useChainStore';
import { translations } from '../../../../../../locales/i18n';
import {
  createRangePositionTx,
  roundDownTick,
  roundUpTick,
} from '../../../../BobAmmPage/ambient-utils';
import { checkAndPrepareApproveTransaction } from '../../AmbientMarketMaking/components/AmbientPoolPositions/AmbientPoolPositions.utils';
import { useDepositContext } from '../contexts/BobDepositModalContext';
import { useGetPoolInfo } from './useGetPoolInfo';

export const useHandleSubmit = (pool: Pool, onComplete: () => void) => {
  const chainId = useCurrentChain();
  const { account, signer } = useAccount();
  const { croc } = useCrocContext();
  const { poolTokens } = useGetPoolInfo(pool);
  const {
    minimumPrice,
    maximumPrice,
    firstAssetValue,
    secondAssetValue,
    maximumSlippage,
    isBalancedRange,
    rangeWidth,
    usesBaseToken,
    isFirstAssetOutOfRange,
    isSecondAssetOutOfRange,
  } = useDepositContext();

  const { setTransactions, setIsOpen, setTitle } = useTransactionContext();

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

    const approveA = await checkAndPrepareApproveTransaction({
      account,
      token: poolTokens.tokenA,
      assetAmount: firstAssetBigNumberAmount,
      chainId,
      signer,
    });

    const approveB = await checkAndPrepareApproveTransaction({
      account,
      token: poolTokens.tokenB,
      assetAmount: secondAssetBigNumberAmount,
      chainId,
      signer,
    });

    if (approveA) {
      transactions.push(approveA);
    }

    if (approveB) {
      transactions.push(approveB);
    }

    const gridSize = (await croc.context).chain.gridSize;

    const tick = {
      low: roundDownTick(priceToTick(minimumPrice), gridSize),
      high: roundUpTick(priceToTick(maximumPrice), gridSize),
    };

    const tx = await createRangePositionTx({
      crocEnv: croc,
      isAmbient: isBalancedRange && rangeWidth === 100,
      slippageTolerancePercentage: maximumSlippage,
      tokenA: {
        address: poolTokens.tokenA.tokenAddr,
        qty: firstAssetBigNumberAmount,
        isWithdrawFromDexChecked: true,
      },
      tokenB: {
        address: poolTokens.tokenB.tokenAddr,
        qty: secondAssetBigNumberAmount,
        isWithdrawFromDexChecked: true,
      },
      isTokenAPrimaryRange: usesBaseToken,
      tick,
      lpConduit: pool.extra.lpToken,
      poolIndex: pool.extra.poolIdx,
    });

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
          : BigNumber.from(GAS_LIMIT.MARKET_MAKING_DEPOSIT),
      },
      onComplete,
    });

    setTransactions(transactions);
    setTitle(t(translations.bobMarketMakingPage.depositModal.title));
    setIsOpen(true);
  }, [
    croc,
    poolTokens,
    signer,
    isFirstAssetOutOfRange,
    firstAssetValue,
    isSecondAssetOutOfRange,
    secondAssetValue,
    account,
    chainId,
    minimumPrice,
    maximumPrice,
    isBalancedRange,
    rangeWidth,
    maximumSlippage,
    usesBaseToken,
    pool.extra.lpToken,
    pool.extra.poolIdx,
    onComplete,
    setTransactions,
    setTitle,
    setIsOpen,
  ]);

  return onSubmit;
};
