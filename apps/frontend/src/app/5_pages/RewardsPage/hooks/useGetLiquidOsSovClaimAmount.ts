import { useCallback, useEffect, useMemo, useState } from 'react';

import { Decimal } from '@sovryn/utils';

import { MS } from '../../../../constants/general';
import { useAccount } from '../../../../hooks/useAccount';
import { useGetProtocolContract } from '../../../../hooks/useGetContract';
import { useGetLockDate } from '../../StakePage/components/StakesFrame/hooks/useGetLockDate';

export const useGetLiquidOsSovClaimAmount = () => {
  const [value, setValue] = useState({
    amount: Decimal.ZERO,
    nextWithdrawTimestamp: 0,
    loading: true,
  });

  const { account } = useAccount();
  const stakingRewardsOs = useGetProtocolContract('stakingRewardsOs');
  const now = useMemo(() => Math.ceil(Date.now() / MS), []);
  const { lockDate } = useGetLockDate(now);

  const getRewards = useCallback(async () => {
    if (!account || !stakingRewardsOs) {
      return {
        amount: Decimal.ZERO,
        nextWithdrawTimestamp: 0,
        loading: false,
      };
    }

    let result = await stakingRewardsOs.getStakerCurrentReward(true, 0);
    let nextWithdrawTimestamp = 0;
    let checkpointCount = 15;

    // Calls getStakerCurrentReward(true, 0) until either:
    // a) The user's reward amount is non-zero or nextWithdrawTimestamp is outside the locked period
    // b) The maximum checkpoint count is reached

    try {
      while (
        result.amount.isZero() &&
        result.nextWithdrawTimestamp >= 0 &&
        result.nextWithdrawTimestamp < lockDate &&
        checkpointCount > 0
      ) {
        nextWithdrawTimestamp = result.nextWithdrawTimestamp.toNumber();

        if (nextWithdrawTimestamp === 0 || nextWithdrawTimestamp >= lockDate) {
          break;
        }

        result = await stakingRewardsOs.getStakerCurrentReward(true, 0);

        if (
          !result.amount.isZero() ||
          nextWithdrawTimestamp === 0 ||
          nextWithdrawTimestamp >= lockDate
        ) {
          break;
        }

        checkpointCount--;
      }

      return {
        amount: result.amount.isZero()
          ? Decimal.ZERO
          : Decimal.fromBigNumberString(result.amount),
        nextWithdrawTimestamp,
        loading: false,
      };
    } catch (error) {
      console.error('Error fetching rewards:', error);
      return {
        amount: Decimal.ZERO,
        nextWithdrawTimestamp: 0,
        loading: false,
      };
    }
  }, [account, stakingRewardsOs, lockDate]);

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
