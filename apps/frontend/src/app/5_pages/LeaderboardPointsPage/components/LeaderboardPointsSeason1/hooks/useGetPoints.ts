import { useMemo } from 'react';

import { useAccount } from '../../../../../../hooks/useAccount';
import { areAddressesEqual } from '../../../../../../utils/helpers';
import { UserPoints } from '../../../LeaderboardPointsPage.types';
import {
  EXTRA_SPICE_POINTS_MULTIPLIER,
  RUNES_POINTS_MULTIPLIER,
} from '../LeaderboardPointsSeason1.constants';
import usersPointsList from '../data/usersPoints.json';
import usersExtraPointsList from '../../../data/usersExtraPoints.json';
import { mergeExtraPoints } from '../../../LeaderboardPointsPage.utils';

const users: UserPoints[] = usersPointsList;
const extraData = usersExtraPointsList.map(({ toAddress, points }) => ({
  wallet: toAddress,
  extraSpiceShot: parseFloat(points),
}));

export const useGetPoints = () => {
  const { account } = useAccount();

  const data = useMemo(() => mergeExtraPoints(users, extraData), []);

  const userIndex = useMemo(
    () => data.findIndex(user => areAddressesEqual(user.wallet, account)),
    [data, account],
  );

  const connectedWalletPoints = useMemo(() => {
    if (userIndex !== -1) {
      const { wallet, points, extraSpiceShot } = data[userIndex];
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
  }, [data, userIndex]);

  const points = useMemo(
    () =>
      data.map(({ wallet, points, extraSpiceShot }, index) => ({
        id: index + 1,
        wallet,
        spice: points,
        extraSpice: points * EXTRA_SPICE_POINTS_MULTIPLIER,
        extraSpiceShot,
        runes: points * RUNES_POINTS_MULTIPLIER,
      })),
    [data],
  );

  return {
    connectedWalletPoints,
    points,
  };
};
