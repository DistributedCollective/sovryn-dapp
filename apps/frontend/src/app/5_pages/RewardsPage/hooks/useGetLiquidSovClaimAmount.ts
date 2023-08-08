import { useCallback, useEffect, useState } from 'react';

import { useAccount } from '../../../../hooks/useAccount';
import { useGetProtocolContract } from '../../../../hooks/useGetContract';
import { decimalic } from '../../../../utils/math';

export const useGetLiquidSovClaimAmount = () => {
  const [value, setValue] = useState({
    lastWithdrawalInterval: 0,
    amount: '0',
    loading: true,
  });

  const { account } = useAccount();
  const staking = useGetProtocolContract('staking');
  const stakingRewards = useGetProtocolContract('stakingRewards');

  const getRewards = useCallback(async () => {
    if (!account || !staking || !stakingRewards) {
      return {
        lastWithdrawalInterval: 0,
        amount: '0',
        loading: false,
      };
    }

    const now = Math.ceil(Date.now() / 1000);
    const lockDate = await staking.timestampToLockDate(now);

    let checks = 30;
    let amount = 0;
    let lastWithdrawalInterval = 0;
    let restartTime = 0;

    // If lastWithdrawalInterval > 0 and amount = 0
    // call getStakerCurrentReward(True, lastWithdrawalInterval)
    // Stop when: a) Both lastWithdrawalInterval > 0 and amount > 0 OR b) lastWithdrawalInterval(returned) > currentTimeStamp
    // as additional brake, run at maximum 30 checks

    while (
      !(
        (lastWithdrawalInterval > 0 && amount > 0) ||
        lastWithdrawalInterval === lockDate ||
        checks < 0
      )
    ) {
      try {
        const result = await stakingRewards
          .getStakerCurrentReward(false, lastWithdrawalInterval)
          .then(response => ({
            lastWithdrawalInterval: Number(response.lastWithdrawalInterval),
            amount: Number(response.amount.toString()),
          }));

        if (result.amount > 0) {
          restartTime = lastWithdrawalInterval;
        }

        lastWithdrawalInterval = result.lastWithdrawalInterval;
        amount = result.amount;
        checks--;
      } catch (e) {
        console.error(e);
        break;
      }
    }

    return {
      lastWithdrawalInterval: restartTime,
      amount: decimalic(amount).toString(),
    };
  }, [account, staking, stakingRewards]);

  useEffect(() => {
    getRewards().then(({ lastWithdrawalInterval, amount }) =>
      setValue({ lastWithdrawalInterval, amount, loading: false }),
    );
  }, [getRewards]);

  return { ...value, refetch: () => getRewards() };
};
