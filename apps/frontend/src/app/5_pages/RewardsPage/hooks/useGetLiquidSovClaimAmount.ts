import { useCallback, useEffect, useState } from 'react';

import { Decimal } from '@sovryn/utils';

import { useAccount } from '../../../../hooks/useAccount';
import { useCurrentChain } from '../../../../hooks/useChainStore';
import { useGetProtocolContract } from '../../../../hooks/useGetContract';

export const useGetLiquidSovClaimAmount = () => {
  const [value, setValue] = useState({
    lastWithdrawalInterval: 0,
    amount: Decimal.ZERO,
    loading: true,
  });

  const { account } = useAccount();
  const chainId = useCurrentChain();
  const staking = useGetProtocolContract('staking', chainId);
  const stakingRewards = useGetProtocolContract('stakingRewards', chainId);

  const getRewards = useCallback(async () => {
    if (!account || !staking || !stakingRewards) {
      return {
        lastWithdrawalInterval: 0,
        amount: Decimal.ZERO,
        loading: false,
      };
    }

    const now = Math.ceil(Date.now() / 1000);
    const startTime = await stakingRewards.startTime();
    const maxDuration = await stakingRewards.maxDuration();
    const result = await stakingRewards.getStakerCurrentReward(false, 0);

    let checks = 30;
    let intervalAmount = 0;
    let lastWithdrawalInterval = 0;
    let restartTime = Number(startTime);

    // Call getStakerCurrentReward(True, restartTime) until either
    // a) lastWithdrawalInterval > 0 and amount > 0 OR b) restartTime >= now
    // as additional brake, run at maximum 30 checks

    while (
      !(
        (lastWithdrawalInterval > 0 && intervalAmount > 0) ||
        restartTime >= now ||
        checks < 0
      )
    ) {
      try {
        const result = await stakingRewards
          .getStakerCurrentReward(true, restartTime)
          .then(response => ({
            lastWithdrawalInterval: Number(response.lastWithdrawalInterval),
            amount: Number(response.amount.toString()),
          }));

        if (result.amount > 0) {
          restartTime = lastWithdrawalInterval;
        }

        if (result.amount === 0) {
          restartTime += Number(maxDuration);
        }

        lastWithdrawalInterval = result.lastWithdrawalInterval;
        intervalAmount = result.amount;
        checks--;
      } catch (e) {
        console.error(e);
        break;
      }
    }

    return {
      lastWithdrawalInterval: restartTime,
      amount:
        !result?.amount || result.amount === '0'
          ? Decimal.ZERO
          : Decimal.fromBigNumberString(result.amount),
    };
  }, [account, staking, stakingRewards]);

  const updateRewards = useCallback(
    () =>
      getRewards().then(({ lastWithdrawalInterval, amount }) =>
        setValue({ lastWithdrawalInterval, amount, loading: false }),
      ),
    [getRewards],
  );

  useEffect(() => {
    updateRewards();
  }, [updateRewards]);

  return { ...value, refetch: updateRewards };
};
