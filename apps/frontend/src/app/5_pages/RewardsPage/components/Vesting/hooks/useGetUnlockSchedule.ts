import { useEffect, useMemo } from 'react';

import dayjs from 'dayjs';

import { rskClient } from '../../../../../../utils/clients';
import { useGetVestingHistoryQuery } from '../../../../../../utils/graphql/rsk/generated';
import {
  VestingContractTableRecord,
  VestingHistoryItem,
} from '../Vesting.types';
import { useVestingContext } from '../context/VestingContext';

const MAXIMUM_UNLOCKED_DATES = 2;

export const useGetUnlockSchedule = (
  item: VestingContractTableRecord,
): VestingHistoryItem[] | undefined => {
  const update = useVestingContext().update;
  const { data } = useGetVestingHistoryQuery({
    variables: { vestingAddress: item.address },
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
      return undefined;
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

    if (!pastDatesLength || pastDatesLength < MAXIMUM_UNLOCKED_DATES) {
      return { unlockDates, pastDatesLength };
    }

    return {
      unlockDates: unlockDates.slice(pastDatesLength - MAXIMUM_UNLOCKED_DATES),
      pastDatesLength,
    };
  }, [data?.vestingContracts]);

  useEffect(() => {
    update(state => {
      state.count = result?.pastDatesLength || 0;
    });
  }, [result?.pastDatesLength, update]);

  return result?.unlockDates;
};
