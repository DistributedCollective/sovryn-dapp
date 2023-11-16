import { useEffect, useState } from 'react';

import { ethers } from 'ethers';

import { SupportedTokens, getTokenContract } from '@sovryn/contracts';
import { getProvider } from '@sovryn/ethers-provider';
import { Decimal } from '@sovryn/utils';

import { defaultChainId } from '../../../../../../config/chains';

import { AmmLiquidityPool } from '../../../utils/AmmLiquidityPool';
import { WEEKLY_REWARDS_AMOUNT } from '../AdjustAndDepositModal.constants';

export const useGetPoolBalanceAndRewards = (
  pool: AmmLiquidityPool,
  newPoolBalanceA: Decimal,
  rbtcPrice: Decimal,
) => {
  const [weeklyRewardsEstimation, setWeeklyRewardsEstimation] =
    useState<Decimal>(Decimal.ZERO);

  useEffect(() => {
    const fetchPoolBalance = async () => {
      try {
        const { abi, address } = await getTokenContract(
          SupportedTokens.wrbtc,
          defaultChainId,
        );
        const contract = new ethers.Contract(
          address,
          abi,
          getProvider(defaultChainId),
        );

        if (!contract) {
          return;
        }

        const poolBalance = await contract
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
  }, [newPoolBalanceA, pool.converter, pool.assetB, rbtcPrice]);

  return { weeklyRewardsEstimation };
};
