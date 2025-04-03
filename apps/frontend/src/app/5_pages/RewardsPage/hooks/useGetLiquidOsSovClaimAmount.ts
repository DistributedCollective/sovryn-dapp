import { useCallback, useEffect, useMemo, useState } from 'react';

import { Decimal } from '@sovryn/utils';

import { MS } from '../../../../constants/general';
import { useAccount } from '../../../../hooks/useAccount';
import { useCurrentChain } from '../../../../hooks/useChainStore';
import { useGetProtocolContract } from '../../../../hooks/useGetContract';
import { useGetLockDate } from '../../StakePage/components/StakesFrame/hooks/useGetLockDate';

export const useGetLiquidOsSovClaimAmount = () => {
  const [value, setValue] = useState({
    amount: Decimal.ZERO,
    withdrawTimestamp: 0,
    loading: true,
  });

  const { account } = useAccount();
  const chainId = useCurrentChain();
  const stakingRewardsOs = useGetProtocolContract('stakingRewardsOs', chainId);
  const now = useMemo(() => Math.ceil(Date.now() / MS), []);
  const { lockDate } = useGetLockDate(now);

  const getRewards = useCallback(async () => {
    if (!account || !stakingRewardsOs) {
      return { amount: Decimal.ZERO, withdrawTimestamp: 0, loading: false };
    }

    let nextWithdrawTimestamp = 0;
    let withdrawTimestamp = 0;
    let amount = Decimal.ZERO;
    let checkpointCount = 15;

    try {
      while (checkpointCount > 0) {
        const result = await stakingRewardsOs.getArbitraryStakerCurrentReward(
          true,
          nextWithdrawTimestamp,
          account,
        );

        if (!result.amount.isZero()) {
          amount = Decimal.fromBigNumberString(result.amount);
          withdrawTimestamp = nextWithdrawTimestamp; // Save the timestamp that gave a positive amount
          break;
        }

        nextWithdrawTimestamp = result.nextWithdrawTimestamp?.toNumber() || 0;

        if (nextWithdrawTimestamp === 0 || nextWithdrawTimestamp >= lockDate) {
          console.log('Breaking loop, no rewards or past lock date');
          break;
        }

        checkpointCount--;
      }

      return { amount, withdrawTimestamp, loading: false };
    } catch (error) {
      console.error('Error fetching rewards:', error);
      return { amount: Decimal.ZERO, withdrawTimestamp: 0, loading: false };
    }
  }, [account, stakingRewardsOs, lockDate]);

  const updateRewards = useCallback(() => {
    getRewards().then(({ amount, withdrawTimestamp, loading }) => {
      setValue({ amount, withdrawTimestamp, loading });
    });
  }, [getRewards]);

  useEffect(() => {
    updateRewards();
  }, [updateRewards]);

  return { ...value, refetch: updateRewards };
};
