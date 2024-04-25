import { useCallback } from 'react';

import { BigNumber } from 'ethers';
import { t } from 'i18next';

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
import { PoolPositionType } from '../../../MarketMakingPage.types';
import { useGetPool } from '../../../hooks/useGetPool';
import { AmbientPosition } from '../../AmbientMarketMaking/AmbientMarketMaking.types';
import { AmbientLiquidityPool } from '../../AmbientMarketMaking/utils/AmbientLiquidityPool';
import { AmbientLiquidityPoolDictionary } from '../../AmbientMarketMaking/utils/AmbientLiquidityPoolDictionary';
import { DEFAULT_SLIPPAGE } from '../../BobDepositModal/BobDepositModal.constants';

export const useHandleSubmit = (
  withdrawAmount: BigNumber,
  isFullWithdrawal: boolean,
  pool: AmbientLiquidityPool,
  position: AmbientPosition,
  onComplete: () => void,
) => {
  const { signer } = useAccount();
  const { croc } = useCrocContext();
  const { poolTokens } = useGetPool(pool.base, pool.quote);

  const chainId = useCurrentChain();
  const { setTransactions, setIsOpen, setTitle } = useTransactionContext();

  const onSubmit = useCallback(async () => {
    if (!croc || !poolTokens || !signer) {
      return;
    }

    const transactions: Transaction[] = [];

    const ambientPool = AmbientLiquidityPoolDictionary.get(
      pool.base,
      pool.quote,
      chainId,
    );

    const crocPool = croc.pool(
      poolTokens.tokenA.tokenAddr,
      poolTokens.tokenB.tokenAddr,
      ambientPool.poolIndex,
    );

    const poolPrice = await crocPool.displayPrice();

    const price = {
      min: poolPrice * (1 - DEFAULT_SLIPPAGE / 100),
      max: poolPrice * (1 + DEFAULT_SLIPPAGE / 100),
    };

    let calldata: string = '';

    try {
      if (position.positionType === PoolPositionType.ambient) {
        if (isFullWithdrawal) {
          calldata = await crocPool.burnAmbientAll([price.min, price.max], {
            lpConduit: ambientPool?.lpTokenAddress,
          });
        } else {
          calldata = await crocPool.burnAmbientLiq(
            withdrawAmount,
            [price.min, price.max],
            {
              lpConduit: ambientPool?.lpTokenAddress,
            },
          );
        }
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
    isFullWithdrawal,
    position,
    onComplete,
    chainId,
    pool,
  ]);

  return onSubmit;
};
