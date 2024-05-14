import { useMemo } from 'react';

import { useAccount } from '../../../../hooks/useAccount';
import { areAddressesEqual } from '../../../../utils/helpers';
import {
  EXTRA_SPICE_POINTS_MULTIPLIER,
  RUNES_POINTS_MULTIPLIER,
} from '../LeaderboardPointsPage.constants';
import { User, UserPoints } from '../LeaderboardPointsPage.types';
import usersPointsList from '../data/usersPoints.json';

const data: UserPoints[] = usersPointsList;

export const useGetPoints = () => {
  const { account } = useAccount();

  const sortedUsers = useMemo(() => {
    return data.sort((a, b) => b.points - a.points);
  }, []);

  const userIndex = useMemo(() => {
    return sortedUsers.findIndex(user =>
      areAddressesEqual(user.wallet, account),
    );
  }, [sortedUsers, account]);

  const connectedWalletPoints: User[] = useMemo(() => {
    if (userIndex !== -1) {
      const { wallet, points } = sortedUsers[userIndex];
      return [
        {
          id: userIndex + 1,
          wallet,
          spice: points,
          extraSpice: points * EXTRA_SPICE_POINTS_MULTIPLIER,
          runes: points * RUNES_POINTS_MULTIPLIER,
        },
      ];
    }
    return [];
  }, [sortedUsers, userIndex]);

  const points: User[] = useMemo(
    () =>
      sortedUsers.map(({ wallet, points }, index) => ({
        id: index + 1,
        wallet,
        spice: points,
        extraSpice: points * EXTRA_SPICE_POINTS_MULTIPLIER,
        runes: points * RUNES_POINTS_MULTIPLIER,
      })),
    [sortedUsers],
  );

  return {
    connectedWalletPoints,
    points,
  };
};
