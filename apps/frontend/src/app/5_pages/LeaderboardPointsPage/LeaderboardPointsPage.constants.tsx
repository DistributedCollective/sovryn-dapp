import React from 'react';

import { t } from 'i18next';

import { translations } from '../../../locales/i18n';
import { LeaderboardPointsSeason1 } from './components/LeaderboardPointsSeason1/LeaderboardPointsSeason1';
import { LeaderboardPointsSeason2 } from './components/LeaderboardPointsSeason2/LeaderboardPointsSeason2';

const ACTIVE_CLASSNAME = 'border-t-primary-30';

export const TAB_ITEMS = [
  {
    label: t(translations.leaderboardPointsPage.season1),
    content: <LeaderboardPointsSeason1 />,
    activeClassName: ACTIVE_CLASSNAME,
    dataAttribute: 'season-1',
  },
  {
    label: t(translations.leaderboardPointsPage.season2),
    content: <LeaderboardPointsSeason2 />,
    activeClassName: ACTIVE_CLASSNAME,
    dataAttribute: 'season-2',
  },
];
