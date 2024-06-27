import React from 'react';

import { Paragraph, prettyTx } from '@sovryn/ui';
import { UserExtraPoints, UserPoints } from './LeaderboardPointsPage.types';
import { areAddressesEqual } from '../../../utils/helpers';

export const generateRowTitle = (id: number, wallet: string) => (
  <Paragraph className="flex justify-between w-full">
    <span>{id}</span>
    <span>{prettyTx(wallet, 4)}</span>
  </Paragraph>
);

export const mergeExtraPoints = (
  users: UserPoints[],
  extraPoints: UserExtraPoints[],
) => {
  const merged = users.map((user: UserPoints) => {
    const extraPointData = extraPoints.find(extra =>
      areAddressesEqual(extra.wallet, user.wallet),
    );
    return {
      ...user,
      extraSpiceShot: extraPointData ? extraPointData.extraSpiceShot : 0,
    };
  });

  merged.sort((a, b) => b.points - a.points);

  return merged;
};
