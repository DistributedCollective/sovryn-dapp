import React from 'react';

import { t } from 'i18next';

import { prettyTx } from '@sovryn/ui';

import { AmountRenderer } from '../../2_molecules/AmountRenderer/AmountRenderer';
import { translations } from '../../../locales/i18n';
import { User } from './LeaderboardPointsPage.types';
import { BalanceRenderer } from './components/BalanceRenderer/BalanceRenderer';

export const CAMPAIGN_URL = 'https://wiki.sovryn.com/en/spice-campaign';

export const MAXIMUM_USERS_TO_SHOW = 50;
export const EXTRA_SPICE_POINTS_MULTIPLIER = 0.5;
export const RUNES_POINTS_MULTIPLIER = 3.14;

export const COLUMNS_CONFIG = (isUserPosition: boolean = false) => [
  {
    id: '',
    title: '',
    cellRenderer: (user: User) => user.id,
    className: 'hidden lg:table-cell',
  },
  {
    id: 'position',
    title: isUserPosition
      ? t(translations.leaderboardPointsPage.table.yourPosition)
      : t(translations.leaderboardPointsPage.table.position),
    cellRenderer: (user: User) => (
      <div className="text-right lg:text-left w-full">
        {prettyTx(user.wallet, 4)}
      </div>
    ),
    className: 'hidden lg:table-cell',
  },
  {
    id: 'balance',
    title: t(translations.leaderboardPointsPage.table.balance),
    cellRenderer: (user: User) => <BalanceRenderer user={user} />,
  },
  {
    id: 'spice',
    title: t(translations.leaderboardPointsPage.table.spice),
    cellRenderer: (user: User) => <AmountRenderer value={user.spice} />,
  },
  {
    id: 'extraSpice',
    title: t(translations.leaderboardPointsPage.table.extraSpice),
    cellRenderer: (user: User) => <AmountRenderer value={user.extraSpice} />,
  },
  {
    id: 'runes',
    title: t(translations.leaderboardPointsPage.table.runes),
    cellRenderer: (user: User) => <AmountRenderer value={user.runes} />,
  },
];
