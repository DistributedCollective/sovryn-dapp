import { useMemo } from 'react';

import dayjs from 'dayjs';

import { useAccount } from '../../../../../../hooks/useAccount';
import { rskClient } from '../../../../../../utils/clients';
import {
  useGetUserVestingsOfTypeQuery,
  VestingContractType,
} from '../../../../../../utils/graphql/rsk/generated';

export const useGetUnclaimedUserVestingCount = () => {
  const { account } = useAccount();
  const { data } = useGetUserVestingsOfTypeQuery({
    variables: {
      user: account.toLowerCase(),
      type: VestingContractType.Rewards,
    },
    client: rskClient,
  });

  const result = useMemo(() => {
    const stakeHistoryItems = data?.vestingContracts[0]?.stakeHistory?.map(
      item => ({
        amount: item.amount,
        lockedUntil: item.lockedUntil,
      }),
    );

    if (!stakeHistoryItems) {
      return 0;
    }

    const normalizedStakeHistoryItems = stakeHistoryItems.reduce((map, obj) => {
      const { lockedUntil, amount } = obj;
      map.set(lockedUntil, (map.get(lockedUntil) || 0) + Number(amount));
      return map;
    }, new Map());

    const unlockDates = Array.from(
      normalizedStakeHistoryItems,
      ([lockedUntil, amount]) => ({
        lockedUntil,
        amount,
        isUnlocked: lockedUntil <= dayjs().unix(),
      }),
    ).sort((a, b) => a.lockedUntil - b.lockedUntil);

    const pastDatesLength = unlockDates?.filter(item => item.isUnlocked).length;

    return pastDatesLength;
  }, [data?.vestingContracts]);

  return result;
};
