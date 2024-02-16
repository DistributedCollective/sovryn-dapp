import React from 'react';

import { SocialLeaderboard } from './components/SocialLeaderboard/SocialLeaderboard';
import { StakingLeaderboard } from './components/StakingLeaderboard/StakingLeaderboard';
import { TradingLeaderboard } from './components/TradingLeaderboard/TradingLeaderboard';

const ACTIVE_CLASSNAME = 'border-t-primary-30';

export const TAB_ITEMS = [
  {
    label: 'Trading',
    content: <TradingLeaderboard />,
    activeClassName: ACTIVE_CLASSNAME,
    dataAttribute: 'trading',
  },
  {
    label: 'Staking',
    content: <StakingLeaderboard />,
    activeClassName: ACTIVE_CLASSNAME,
    dataAttribute: 'staking',
  },
  {
    label: 'Social',
    content: <SocialLeaderboard />,
    activeClassName: ACTIVE_CLASSNAME,
    dataAttribute: 'social',
  },
];
