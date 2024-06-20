import { useCallback, useMemo } from 'react';

import { useAccount } from '../../../../hooks/useAccount';
import { areAddressesEqual } from '../../../../utils/helpers';
import {
  EXTRA_SPICE_POINTS_MULTIPLIER,
  RUNES_POINTS_MULTIPLIER,
} from '../LeaderboardPointsPage.constants';
import { UserPoints } from '../LeaderboardPointsPage.types';
import usersExtraPointsList from '../data/usersExtraPoints.json';
import usersPointsList from '../data/usersPoints.json';

const data: UserPoints[] = usersPointsList;
const extraData = usersExtraPointsList.map(({ toAddress, points }) => ({
  wallet: toAddress,
  extraSpiceShot: parseFloat(points),
}));

export const useGetPoints = () => {
  const { account } = useAccount();

  const mergeExtraPoints = useCallback(
    (users, extraPoints) =>
      users.map(user => {
        const extraPointData = extraPoints.find(extra =>
          areAddressesEqual(extra.wallet, user.wallet),
        );
        return {
          ...user,
          extraSpiceShot: extraPointData ? extraPointData.extraSpiceShot : 0,
        };
      }),
    [],
  );

  const mergedData = useMemo(
    () => mergeExtraPoints(data, extraData),
    [mergeExtraPoints],
  );

  const sortedUsers = useMemo(() => {
    const users = [...mergedData];
    users.sort((a, b) => b.points - a.points);
    return users;
  }, [mergedData]);

  const userIndex = useMemo(
    () =>
      sortedUsers.findIndex(user => areAddressesEqual(user.wallet, account)),
    [sortedUsers, account],
  );

  const connectedWalletPoints = useMemo(() => {
    if (userIndex !== -1) {
      const { wallet, points, extraSpiceShot } = sortedUsers[userIndex];
      return [
        {
          id: userIndex + 1,
          wallet,
          spice: points,
          extraSpice: points * EXTRA_SPICE_POINTS_MULTIPLIER,
          extraSpiceShot,
          runes: points * RUNES_POINTS_MULTIPLIER,
        },
      ];
    }
    return [];
  }, [sortedUsers, userIndex]);

  const points = useMemo(
    () =>
      sortedUsers.map(({ wallet, points, extraSpiceShot }, index) => ({
        id: index + 1,
        wallet,
        spice: points,
        extraSpice: points * EXTRA_SPICE_POINTS_MULTIPLIER,
        extraSpiceShot,
        runes: points * RUNES_POINTS_MULTIPLIER,
      })),
    [sortedUsers],
  );

  return {
    connectedWalletPoints,
    points,
  };
};
