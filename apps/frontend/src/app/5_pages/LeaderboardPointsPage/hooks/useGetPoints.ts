import { useMemo } from 'react';

import { useAccount } from '../../../../hooks/useAccount';
import { areAddressesEqual } from '../../../../utils/helpers';
import {
  EXTRA_SPICE_POINTS_MULTIPLIER,
  RUNES_POINTS_MULTIPLIER,
} from '../LeaderboardPointsPage.constants';
import { UserPoints } from '../LeaderboardPointsPage.types';
import { mergeExtraPoints } from '../LeaderboardPointsPage.utils';
import usersExtraPointsList from '../data/usersExtraPoints.json';
import usersPointsList from '../data/usersPoints.json';

const data: UserPoints[] = usersPointsList;
const extraData = usersExtraPointsList.map(({ toAddress, points }) => ({
  wallet: toAddress,
  extraSpiceShot: parseFloat(points),
}));

export const useGetPoints = () => {
  const { account } = useAccount();

  const mergedAndSortedData = useMemo(
    () => mergeExtraPoints(data, extraData),
    [],
  );

  const userIndex = useMemo(
    () =>
      mergedAndSortedData.findIndex(user =>
        areAddressesEqual(user.wallet, account),
      ),
    [mergedAndSortedData, account],
  );

  const connectedWalletPoints = useMemo(() => {
    if (userIndex !== -1) {
      const { wallet, points, extraSpiceShot } = mergedAndSortedData[userIndex];
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
  }, [mergedAndSortedData, userIndex]);

  const points = useMemo(
    () =>
      mergedAndSortedData.map(({ wallet, points, extraSpiceShot }, index) => ({
        id: index + 1,
        wallet,
        spice: points,
        extraSpice: points * EXTRA_SPICE_POINTS_MULTIPLIER,
        extraSpiceShot,
        runes: points * RUNES_POINTS_MULTIPLIER,
      })),
    [mergedAndSortedData],
  );

  return {
    connectedWalletPoints,
    points,
  };
};
