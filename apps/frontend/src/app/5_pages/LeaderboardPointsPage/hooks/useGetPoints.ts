import { useMemo } from 'react';

import { useAccount } from '../../../../hooks/useAccount';
import { areAddressesEqual } from '../../../../utils/helpers';
import {
  EXTRA_SPICE_POINTS_MULTIPLIER,
  RUNES_POINTS_MULTIPLIER,
} from '../LeaderboardPointsPage.constants';
import { User } from '../LeaderboardPointsPage.types';
import usersPointsList from '../data/usersPoints.json';

export const useGetPoints = (pageSize: number, page: number) => {
  const { account } = useAccount();
  const startIndex = page * pageSize;
  const endIndex = Math.min(startIndex + pageSize, usersPointsList.length);

  const sortedUsers = useMemo(() => {
    return usersPointsList.sort((a, b) => b.points - a.points);
  }, []);

  const userIndex = useMemo(() => {
    return sortedUsers.findIndex(user =>
      areAddressesEqual(user.wallet, account),
    );
  }, [sortedUsers, account]);

  const userPoints: User[] = useMemo(() => {
    if (userIndex !== -1) {
      const user = sortedUsers[userIndex];
      return [
        {
          id: userIndex + 1,
          wallet: user.wallet,
          spice: user.points,
          extraSpice: user.points * EXTRA_SPICE_POINTS_MULTIPLIER,
          runes: user.points * RUNES_POINTS_MULTIPLIER,
        },
      ];
    }
    return [];
  }, [sortedUsers, userIndex]);

  const usersPoints: User[] = useMemo(
    () =>
      sortedUsers.slice(startIndex, endIndex).map((user, index) => ({
        id: startIndex + index + 1,
        wallet: user.wallet,
        spice: user.points,
        extraSpice: user.points * EXTRA_SPICE_POINTS_MULTIPLIER,
        runes: user.points * RUNES_POINTS_MULTIPLIER,
      })),
    [sortedUsers, startIndex, endIndex],
  );

  return {
    usersPoints,
    userPoints,
  };
};
