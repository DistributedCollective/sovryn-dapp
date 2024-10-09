import { useMemo } from 'react';

import { RSK_CHAIN_ID } from '../../../../../../config/chains';

import { useCacheCall } from '../../../../../../hooks';
import { useAccount } from '../../../../../../hooks/useAccount';
import { areAddressesEqual } from '../../../../../../utils/helpers';
import { UserPoints } from '../../../LeaderboardPointsPage.types';
import {
  DATA_ENDPOINT_URL,
  S3_DATA_ENDPOINT_URL,
} from '../LeaderboardPoints.constants';

export const useGetPoints = () => {
  const { account } = useAccount();

  const { value: data } = useCacheCall(
    'bob-lp-points',
    RSK_CHAIN_ID,
    async () => {
      const [data, s3Data] = await Promise.all([
        fetch(DATA_ENDPOINT_URL).then(response => response?.json()),
        fetch(S3_DATA_ENDPOINT_URL).then(response => response?.json()),
      ]);

      const result: { [key: string]: UserPoints } = {};

      data.forEach(user => {
        const points = parseFloat(user.points.replace(/,/g, ''));

        result[user.toAddress.toLowerCase()] = {
          wallet: user.toAddress,
          points,
          s3Points: 0,
          total: points,
        };
      });

      s3Data.forEach(user => {
        const s3Points = parseFloat(user.points.replace(/,/g, ''));
        const key = user.toAddress.toLowerCase();

        if (!(key in result)) {
          result[key] = {
            wallet: user.toAddress,
            points: 0,
            s3Points,
            total: s3Points,
          };
        } else {
          const points = result[key].points;

          result[key] = {
            wallet: user.toAddress,
            points,
            s3Points,
            total: points + s3Points,
          };
        }
      });

      return Object.keys(result)
        .map(key => ({ ...result[key] }))
        .sort((user1, user2) => (user1.total < user2.total ? 1 : -1));
    },
    [],
    [],
  );

  const userIndex = useMemo(() => {
    return data.findIndex(user => areAddressesEqual(user.wallet, account));
  }, [data, account]);

  const connectedWalletPoints = useMemo(() => {
    if (userIndex !== -1) {
      const { wallet, points, s3Points, total } = data[userIndex];
      return [
        {
          id: userIndex + 1,
          wallet,
          points,
          s3Points,
          total,
        },
      ];
    }
    return [];
  }, [data, userIndex]);

  const points = useMemo(
    () =>
      data.map(({ wallet, points, s3Points, total }, index) => ({
        id: index + 1,
        wallet,
        points,
        s3Points,
        total,
      })),
    [data],
  );

  return {
    connectedWalletPoints,
    points,
  };
};
