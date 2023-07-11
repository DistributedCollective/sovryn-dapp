import { useMemo } from 'react';

import dayjs from 'dayjs';

import { rskClient } from '../../../../../../utils/clients';
import { useGetVestingHistoryQuery } from '../../../../../../utils/graphql/rsk/generated';
import {
  VestingContractTableRecord,
  VestingHistoryItem,
} from '../Vesting.types';

export const useGetUnlockSchedule = (
  item: VestingContractTableRecord,
): VestingHistoryItem[] | undefined => {
  const vestingHistory = useGetVestingHistoryQuery({
    variables: { vestingAddress: item.address },
    client: rskClient,
  });

  const result = useMemo(
    () =>
      vestingHistory?.data?.vestingContracts[0]?.stakeHistory?.map(item => ({
        amount: item.amount,
        lockedUntil: item.lockedUntil,
      })),
    [vestingHistory?.data?.vestingContracts],
  );

  const finalResult = useMemo(() => {
    if (!result) {
      return undefined;
    }

    const newMap = result.reduce((map, obj) => {
      const { lockedUntil, amount } = obj;
      map.set(lockedUntil, (map.get(lockedUntil) || 0) + Number(amount));
      return map;
    }, new Map());

    return Array.from(newMap, ([lockedUntil, amount]) => ({
      lockedUntil,
      amount,
      isUnlocked: lockedUntil <= dayjs().unix(),
    })).sort((a, b) => a.lockedUntil - b.lockedUntil);
  }, [result]);

  return finalResult;
};
