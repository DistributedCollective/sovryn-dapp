import { useCallback, useEffect, useState } from 'react';

import { SupportedTokens } from '@sovryn/contracts';
import { Decimal } from '@sovryn/utils';

import { defaultRskChainId } from '../../../../../../config/chains';

import { useGetTokenContract } from '../../../../../../hooks/useGetContract';
import { decimalic } from '../../../../../../utils/math';
import { useGetTokenPrice } from '../../../../BorrowPage/hooks/useGetTokenPrice';
import { AmmLiquidityPool } from '../../../utils/AmmLiquidityPool';
import { WEEKLY_REWARDS_AMOUNT } from '../AdjustAndDepositModal.constants';

export const useGetPoolBalanceAndRewards = (
  pool: AmmLiquidityPool,
  newPoolBalanceA: Decimal,
) => {
  const [weeklyRewardsEstimation, setWeeklyRewardsEstimation] =
    useState<Decimal>(Decimal.ZERO);

  const poolContract = useGetTokenContract(
    SupportedTokens.wrbtc,
    defaultRskChainId,
  );

  const tokenContract = useGetTokenContract(pool.assetA, defaultRskChainId);
  const { data: tokenPrice } = useGetTokenPrice(tokenContract?.address || '');

  const fetchPoolBalance = useCallback(async () => {
    if (!poolContract || !newPoolBalanceA || !tokenPrice || !tokenContract) {
      return;
    }
    try {
      const poolBalance = await poolContract
        .balanceOf(pool.converter)
        .then(Decimal.fromBigNumberString);
      if (poolBalance) {
        const value = newPoolBalanceA
          .div(poolBalance)
          .mul(WEEKLY_REWARDS_AMOUNT)
          .mul(decimalic(tokenPrice?.token?.lastPriceBtc || '0'));
        setWeeklyRewardsEstimation(value);
      }
    } catch (error) {
      console.error('Error fetching pool balance:', error);
    }
  }, [
    pool.converter,
    newPoolBalanceA,
    tokenPrice,
    poolContract,
    tokenContract,
  ]);

  useEffect(() => {
    fetchPoolBalance();
  }, [fetchPoolBalance]);

  return { weeklyRewardsEstimation };
};
