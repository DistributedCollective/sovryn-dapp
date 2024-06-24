import React from 'react';

import { Paragraph, prettyTx } from '@sovryn/ui';

import { areAddressesEqual } from '../../../utils/helpers';
import {
  User,
  UserExtraPoints,
  UserPoints,
} from './LeaderboardPointsPage.types';

export const generateRowTitle = (user: User) => (
  <Paragraph className="flex justify-between w-full">
    <span>{user.id}</span>
    <span>{prettyTx(user.wallet, 4)}</span>
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
