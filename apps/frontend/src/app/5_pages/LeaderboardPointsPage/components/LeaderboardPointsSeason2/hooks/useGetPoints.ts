import { useMemo } from 'react';

import { useAccount } from '../../../../../../hooks/useAccount';
import { areAddressesEqual } from '../../../../../../utils/helpers';
import { UserPoints } from '../../../LeaderboardPointsPage.types';
import usersPointsList from '../data/usersPoints.json';

const data: UserPoints[] = usersPointsList.map(userPoint => ({
  wallet: userPoint.toAddress,
  points: parseFloat(userPoint.points.replace(/,/g, '')),
}));

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

  const connectedWalletPoints = useMemo(() => {
    if (userIndex !== -1) {
      const { wallet, points } = sortedUsers[userIndex];
      return [
        {
          id: userIndex + 1,
          wallet,
          points,
        },
      ];
    }
    return [];
  }, [sortedUsers, userIndex]);

  const points = useMemo(
    () =>
      sortedUsers.map(({ wallet, points }, index) => ({
        id: index + 1,
        wallet,
        points,
      })),
    [sortedUsers],
  );

  return {
    connectedWalletPoints,
    points,
  };
};
