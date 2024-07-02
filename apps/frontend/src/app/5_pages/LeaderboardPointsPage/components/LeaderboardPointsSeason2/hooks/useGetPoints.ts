import { useEffect, useMemo, useState } from 'react';

import { useAccount } from '../../../../../../hooks/useAccount';
import { areAddressesEqual } from '../../../../../../utils/helpers';
import { UserPoints } from '../../../LeaderboardPointsPage.types';
import { DATA_ENDPOINT_URL } from '../LeaderboardPointsSeason2.constants';

export const useGetPoints = () => {
  const { account } = useAccount();

  const [data, setData] = useState<UserPoints[]>([]);

  useEffect(() => {
    if (!data || data.length === 0) {
      fetch(DATA_ENDPOINT_URL)
        .then(response => response?.json())
        .then(data => {
          if (!data) {
            return;
          }

          const result: UserPoints[] = data.map(user => ({
            wallet: user.toAddress,
            points: parseFloat(user.points.replace(/,/g, '')),
          }));

          setData(result);
        });
    }
  }, [data]);

  const sortedUsers = useMemo(() => {
    return data.sort((a, b) => b.points - a.points);
  }, [data]);

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
