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
import { translations } from '../../../../../../locales/i18n';
import { PoolPositionType } from '../../../MarketMakingPage.types';
import { DEFAULT_SLIPPAGE } from '../../BobDepositModal/BobDepositModal.constants';
import { useGetPoolInfo } from './useGetPoolInfo';
import { useGetPoolLiquidity } from './useGetPoolLiqudity';

export const useHandleSubmit = (
  withdrawAmount: BigNumber,
  assetA: string,
  assetB: string,
  isFullAmountWithdraw: boolean,
  positionType: PoolPositionType,
) => {
  const { signer } = useAccount();
  const { croc } = useCrocContext();
  const { poolTokens } = useGetPoolInfo(assetA, assetB);

  const { liquidity } = useGetPoolLiquidity(assetA, assetB, positionType);
  console.log('liquidity', liquidity.toString());

  const { setTransactions, setIsOpen, setTitle } = useTransactionContext();

  const onSubmit = useCallback(async () => {
    if (!croc || !poolTokens || !signer) {
      return;
    }

    const transactions: Transaction[] = [];

    const pool = croc.pool(
      poolTokens.tokenA.tokenAddr,
      poolTokens.tokenB.tokenAddr,
    );

    const poolPrice = await pool.displayPrice();

    const price = {
      min: poolPrice * (1 - DEFAULT_SLIPPAGE / 100),
      max: poolPrice * (1 + DEFAULT_SLIPPAGE / 100),
    };

    let calldata: string = '';

    try {
      if (positionType === PoolPositionType.ambient) {
        if (isFullAmountWithdraw) {
          calldata = await pool.burnAmbientAll([price.min, price.max]);
        } else {
          calldata = await pool.burnAmbientLiq(withdrawAmount, [
            price.min,
            price.max,
          ]);
        }
      } else if (positionType === PoolPositionType.concentrated) {
        // TODO replace with actual tick values from the pool
        const lowerTick = -665454;
        const upperTick = 831818;
        calldata = await pool.burnRangeLiq(
          BigNumber.from(withdrawAmount),
          [lowerTick, upperTick],
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
        contract: (await pool.context).dex,
        fnName: 'userCmd',
        args: [(await pool.context).chain.proxyPaths.liq, calldata],
        value: 0,
        gasLimit: GAS_LIMIT.WITHDRAW_MARKET_MAKING_LIQUIDITY,
      },
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
    isFullAmountWithdraw,
    positionType,
  ]);

  return onSubmit;
};
