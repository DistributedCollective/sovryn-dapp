import { useCallback } from 'react';

import { t } from 'i18next';

import { Pool } from '@sovryn/sdk';

import {
  Transaction,
  TransactionType,
} from '../../../../../3_organisms/TransactionStepDialog/TransactionStepDialog.types';
import { GAS_LIMIT } from '../../../../../../constants/gasLimits';
import { useTransactionContext } from '../../../../../../contexts/TransactionContext';
import { translations } from '../../../../../../locales/i18n';
import { PoolPositionType } from '../../../MarketMakingPage.types';
import { AmbientPosition } from '../../AmbientMarketMaking/AmbientMarketMaking.types';
import { DEFAULT_SLIPPAGE } from '../../BobDepositModal/BobDepositModal.constants';
import { useGetPoolInfo } from '../../BobDepositModal/hooks/useGetPoolInfo';

export const useHandleSubmit = (
  pool: Pool,
  position: AmbientPosition,
  onComplete: () => void,
) => {
  const { poolTokens, pool: crocPool, price: poolPrice } = useGetPoolInfo(pool);

  const { setTransactions, setIsOpen, setTitle } = useTransactionContext();

  const onSubmit = useCallback(async () => {
    if (!poolTokens || !crocPool || !poolPrice) {
      return;
    }

    const transactions: Transaction[] = [];

    const price = {
      min: poolPrice * (1 - DEFAULT_SLIPPAGE / 100),
      max: poolPrice * (1 + DEFAULT_SLIPPAGE / 100),
    };

    let calldata: string = '';

    try {
      if (position.positionType === PoolPositionType.concentrated) {
        calldata = await crocPool.harvestRange(
          [position.bidTick, position.askTick],
          [price.min, price.max],
        );
      } else {
        console.error('Unsupported position type for harvest');
      }
    } catch (error) {
      console.error('Error while constructing calldata:', error);
    }

    transactions.push({
      title: t(translations.bobMarketMakingPage.claimFeesModal.claimFees),
      request: {
        type: TransactionType.signTransaction,
        contract: (await crocPool.context).dex,
        fnName: 'userCmd',
        args: [(await crocPool.context).chain.proxyPaths.liq, calldata],
        value: 0,
        gasLimit: GAS_LIMIT.MARKET_MAKING_CLAIM_FEES,
      },
      onComplete,
    });

    setTransactions(transactions);
    setTitle(t(translations.bobMarketMakingPage.claimFeesModal.title));
    setIsOpen(true);
  }, [
    crocPool,
    onComplete,
    poolPrice,
    poolTokens,
    position.askTick,
    position.bidTick,
    position.positionType,
    setTitle,
    setIsOpen,
    setTransactions,
  ]);

  return onSubmit;
};
