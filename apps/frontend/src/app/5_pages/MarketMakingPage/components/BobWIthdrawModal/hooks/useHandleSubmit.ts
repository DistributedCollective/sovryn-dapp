import { useCallback } from 'react';

import { BigNumber, constants } from 'ethers';
import { t } from 'i18next';

import { Pool } from '@sovryn/sdk';

import {
  Transaction,
  TransactionType,
} from '../../../../../3_organisms/TransactionStepDialog/TransactionStepDialog.types';
import { GAS_LIMIT } from '../../../../../../constants/gasLimits';
import { useCrocContext } from '../../../../../../contexts/CrocContext';
import { useTransactionContext } from '../../../../../../contexts/TransactionContext';
import { useAccount } from '../../../../../../hooks/useAccount';
import { translations } from '../../../../../../locales/i18n';
import { PoolPositionType } from '../../../MarketMakingPage.types';
import { useGetPool } from '../../../hooks/useGetPool';
import { AmbientPosition } from '../../AmbientMarketMaking/AmbientMarketMaking.types';
import { DEFAULT_SLIPPAGE } from '../../BobDepositModal/BobDepositModal.constants';
import { bigNumberic } from './../../../../../../utils/math';

export const useHandleSubmit = (
  withdrawAmount: BigNumber,
  pool: Pool,
  position: AmbientPosition,
  onComplete: () => void,
) => {
  const { signer } = useAccount();
  const { croc } = useCrocContext();
  const { poolTokens } = useGetPool(pool);

  const { setTransactions, setIsOpen, setTitle } = useTransactionContext();

  const onSubmit = useCallback(async () => {
    if (!croc || !poolTokens || !signer || !pool || !position || !pool.extra) {
      return;
    }

    const transactions: Transaction[] = [];

    const crocPool = croc.pool(
      poolTokens.tokenA.tokenAddr,
      poolTokens.tokenB.tokenAddr,
      pool.extra.poolIdx,
    );

    const poolPrice = await crocPool.displayPrice();

    const price = {
      min: poolPrice * (1 - DEFAULT_SLIPPAGE / 100),
      max: poolPrice * (1 + DEFAULT_SLIPPAGE / 100),
    };

    let calldata: string = '';

    try {
      if (position.positionType === PoolPositionType.ambient) {
        console.log('ambient withdrawAmount', withdrawAmount.toString(), { position });

        calldata = await crocPool.burnAmbientLiq(
          bigNumberic(withdrawAmount),
          [price.min, price.max],
          {
            lpConduit: pool.extra.lpToken,
            // lpConduit: constants.AddressZero,
            // lpConduit: position.lpTokenBalance !== '0' ? pool.extra.lpToken : undefined,
          },
        );
      } else if (position.positionType === PoolPositionType.concentrated) {
        calldata = await crocPool.burnRangeLiq(
          withdrawAmount,
          [position.bidTick, position.askTick],
          [price.min, price.max],
        );
      } else {
        console.debug('Unsupported position type for removal');
      }
    } catch (error) {
      console.error('Error while constructing calldata:', error);
    }

    transactions.push({
      title: t(translations.common.withdraw),
      request: {
        type: TransactionType.signTransaction,
        contract: (await crocPool.context).dex,
        fnName: 'userCmd',
        args: [(await crocPool.context).chain.proxyPaths.liq, calldata],
        value: 0,
        gasLimit: GAS_LIMIT.WITHDRAW_MARKET_MAKING_LIQUIDITY,
      },
      onComplete,
    });

    setTransactions(transactions);
    setTitle(t(translations.bobMarketMakingPage.withdrawModal.title));
    setIsOpen(true);
  }, [
    croc,
    poolTokens,
    signer,
    setTransactions,
    setIsOpen,
    setTitle,
    withdrawAmount,
    position,
    onComplete,
    pool,
  ]);

  return onSubmit;
};
