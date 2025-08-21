import { useCallback } from 'react';

import { BigNumber } from 'ethers';
import { t } from 'i18next';

import { CrocReposition, priceToTick } from '@sovryn/sdex';
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
  roundDownTick,
  roundUpTick,
} from '../../../../BobAmmPage/ambient-utils';
import { AmbientPosition } from '../../AmbientMarketMaking/AmbientMarketMaking.types';
import { checkAndPrepareApproveTransaction } from '../../AmbientMarketMaking/components/AmbientPoolPositions/AmbientPoolPositions.utils';
import { DEFAULT_SLIPPAGE } from '../../BobDepositModal/BobDepositModal.constants';
import { useDepositContext } from '../../BobDepositModal/contexts/BobDepositModalContext';
import { useGetPoolInfo } from '../../BobDepositModal/hooks/useGetPoolInfo';
import { mintArgsForReposition } from '../BobRepositionModal.utils';
import { useGetLiquidity } from './useGetLiquidity';

export const useHandleSubmit = (
  pool: Pool,
  position: AmbientPosition,
  onComplete: () => void,
) => {
  const chainId = useCurrentChain();
  const { account, signer } = useAccount();
  const { croc } = useCrocContext();
  const { poolTokens, pool: crocPool } = useGetPoolInfo(pool);
  const { setTransactions, setIsOpen, setTitle } = useTransactionContext();

  const {
    minimumPrice,
    maximumPrice,
    firstAssetValue,
    secondAssetValue,
    isFirstAssetOutOfRange,
    isSecondAssetOutOfRange,
    rangeWidth,
  } = useDepositContext();

  const { liquidity } = useGetLiquidity(position, pool.extra.poolIdx);

  const onSubmit = useCallback(async () => {
    if (!croc || !poolTokens || !signer || !crocPool || !liquidity) {
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

    const reposition = new CrocReposition(
      crocPool,
      {
        liquidity: liquidity,
        burn: [position.bidTick, position.askTick],
        mint: mintArgsForReposition(tick.low, tick.high, rangeWidth),
      },
      { impact: DEFAULT_SLIPPAGE / 100 },
    );

    const calldata = await reposition.rebal();
    const contract = await crocPool.context;
    const proxyPaths = contract.chain.proxyPaths.long;

    transactions.push({
      title: t(translations.bobMarketMakingPage.repositionModal.title),
      request: {
        type: TransactionType.signTransaction,
        contract: contract.dex,
        fnName: 'userCmd',
        args: [proxyPaths, calldata],
        gasLimit: GAS_LIMIT.MARKET_MAKING_REPOSITION,
      },
      onComplete,
    });

    setTransactions(transactions);
    setTitle(t(translations.bobMarketMakingPage.repositionModal.reposition));
    setIsOpen(true);
  }, [
    account,
    chainId,
    croc,
    liquidity,
    firstAssetValue,
    isSecondAssetOutOfRange,
    isFirstAssetOutOfRange,
    maximumPrice,
    poolTokens,
    secondAssetValue,
    signer,
    minimumPrice,
    position,
    crocPool,
    onComplete,
    setTransactions,
    setIsOpen,
    setTitle,
    rangeWidth,
  ]);

  return onSubmit;
};
