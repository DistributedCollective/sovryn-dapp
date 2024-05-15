import React from 'react';

import { Paragraph, prettyTx } from '@sovryn/ui';

import { User } from './LeaderboardPointsPage.types';

export const generateRowTitle = (user: User) => (
  <Paragraph className="flex justify-between w-full">
    <span>{user.id}</span>
    <span>{prettyTx(user.wallet, 4)}</span>
  </Paragraph>
);
