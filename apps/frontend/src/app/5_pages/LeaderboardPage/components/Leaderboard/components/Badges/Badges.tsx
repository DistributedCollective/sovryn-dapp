import React, { FC } from 'react';

import { Badge } from '@sovryn/ui';

import { User } from '../../Leaderboard.types';
import { getBadgeDetails } from './Badges.utils';

type BadgesProps = {
  user: User;
};

export const Badges: FC<BadgesProps> = ({ user }) => (
  <>
    {user.badges.map(badge => {
      const { title, style } = getBadgeDetails(badge);

      return (
        <Badge content={title} className="p-2 mr-1 rounded" style={style} />
      );
    })}
  </>
);
