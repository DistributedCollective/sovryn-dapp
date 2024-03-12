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

    let result;
    let nextWithdrawTimestamp;

    try {
      while (true) {
        result = await stakingRewardsOs.getStakerCurrentReward(true, 0);
        nextWithdrawTimestamp = result.nextWithdrawTimestamp.toNumber();
        if (!result.amount.isZero() || nextWithdrawTimestamp >= lockDate) {
          break;
        }
      }
    } catch (error) {
      console.error('Error fetching rewards:', error);
      return {
        amount: Decimal.ZERO,
        nextWithdrawTimestamp: 0,
        loading: false,
      };
    }

    return {
      amount: result.amount.isZero()
        ? Decimal.ZERO
        : Decimal.fromBigNumberString(result.amount),
      nextWithdrawTimestamp,
      loading: false,
    };
  }, [account, stakingRewardsOs, lockDate]);

  const updateRewards = useCallback(async () => {
    const rewards = await getRewards();
    setValue(rewards);
  }, [getRewards]);

  useEffect(() => {
    updateRewards();
  }, [updateRewards]);

  return { ...value, refetch: updateRewards };
};
