import React from 'react';

import { t } from 'i18next';

import { translations } from '../../../../../locales/i18n';
import { SocialLeaderboard } from './components/SocialLeaderboard/SocialLeaderboard';
import { StakingLeaderboard } from './components/StakingLeaderboard/StakingLeaderboard';
import { TradingLeaderboard } from './components/TradingLeaderboard/TradingLeaderboard';

const ACTIVE_CLASSNAME = 'border-t-primary-30';

export const TAB_ITEMS = [
  {
    label: t(translations.leaderboardPage.tables.trading.tabTitle),
    content: <TradingLeaderboard />,
    activeClassName: ACTIVE_CLASSNAME,
    dataAttribute: 'trading',
  },
  {
    label: t(translations.leaderboardPage.tables.staking.tabTitle),
    content: <StakingLeaderboard />,
    activeClassName: ACTIVE_CLASSNAME,
    dataAttribute: 'staking',
  },
  {
    label: t(translations.leaderboardPage.tables.social.tabTitle),
    content: <SocialLeaderboard />,
    activeClassName: ACTIVE_CLASSNAME,
    dataAttribute: 'social',
  },
];
