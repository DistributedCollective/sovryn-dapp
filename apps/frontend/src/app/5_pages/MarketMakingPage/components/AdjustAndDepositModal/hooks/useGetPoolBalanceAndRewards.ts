import { useEffect, useState } from 'react';

import { SupportedTokens } from '@sovryn/contracts';
import { Decimal } from '@sovryn/utils';

import { defaultChainId } from '../../../../../../config/chains';

import { useGetTokenContract } from '../../../../../../hooks/useGetContract';
import { AmmLiquidityPool } from '../../../utils/AmmLiquidityPool';
import { WEEKLY_REWARDS_AMOUNT } from '../AdjustAndDepositModal.constants';

export const useGetPoolBalanceAndRewards = (
  pool: AmmLiquidityPool,
  newPoolBalanceA: Decimal,
  rbtcPrice: Decimal,
) => {
  const [weeklyRewardsEstimation, setWeeklyRewardsEstimation] =
    useState<Decimal>(Decimal.ZERO);

  const tokenContract = useGetTokenContract(
    SupportedTokens.wrbtc,
    defaultChainId,
  );

  useEffect(() => {
    const fetchPoolBalance = async () => {
      if (!tokenContract) {
        return;
      }
      try {
        const poolBalance = await tokenContract
          .balanceOf(pool.converter)
          .then(Decimal.fromBigNumberString);
        if (poolBalance) {
          const value = newPoolBalanceA
            .div(poolBalance)
            .mul(WEEKLY_REWARDS_AMOUNT)
            .mul(rbtcPrice);
          setWeeklyRewardsEstimation(value);
        }
      } catch (error) {
        console.error('Error fetching pool balance:', error);
      }
    };

    if (newPoolBalanceA.gt(0) && rbtcPrice) {
      fetchPoolBalance();
    }
  }, [newPoolBalanceA, pool.converter, pool.assetB, rbtcPrice, tokenContract]);

  return { weeklyRewardsEstimation };
};
