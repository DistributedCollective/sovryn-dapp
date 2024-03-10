import { useCallback, useEffect, useState } from 'react';

import { Decimal } from '@sovryn/utils';

import { useAccount } from '../../../../hooks/useAccount';
import { useGetProtocolContract } from '../../../../hooks/useGetContract';

export const useGetLiquidOsSovClaimAmount = () => {
  const [value, setValue] = useState({
    amount: Decimal.from(0),
    nextWithdrawTimestamp: 0,
    loading: true,
  });

  const { account } = useAccount();
  const stakingRewardsOs = useGetProtocolContract('stakingRewardsOs');

  const getRewards = useCallback(async () => {
    if (!account || !stakingRewardsOs) {
      return {
        amount: Decimal.ZERO,
        loading: false,
      };
    }

    try {
      const result = await stakingRewardsOs.getStakerCurrentReward(false, 0);

      return {
        amount:
          !result?.amount || result.amount.isZero()
            ? Decimal.ZERO
            : Decimal.fromBigNumberString(result.amount),
        nextWithdrawTimestamp: result.nextWithdrawTimestamp.toNumber(),
        loading: false,
      };
    } catch (error) {
      console.error('Error fetching rewards:', error);
      return {
        amount: Decimal.ZERO,
        nextWithdrawTimestamp: Decimal.ZERO,
        loading: false,
      };
    }
  }, [account, stakingRewardsOs]);

  const updateRewards = useCallback(() => {
    getRewards().then(({ amount, nextWithdrawTimestamp, loading }) => {
      setValue({ amount, nextWithdrawTimestamp, loading });
    });
  }, [getRewards]);

  useEffect(() => {
    updateRewards();
  }, [updateRewards]);

  return { ...value, refetch: updateRewards };
};
