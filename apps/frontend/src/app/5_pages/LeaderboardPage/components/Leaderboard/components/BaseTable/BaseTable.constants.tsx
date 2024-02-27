import React from 'react';

import { t } from 'i18next';

import { prettyTx } from '@sovryn/ui';

import { AmountRenderer } from '../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { translations } from '../../../../../../../locales/i18n';
import { User } from '../../Leaderboard.types';
import { Badges } from '../Badges/Badges';

export const TRADING_LEADERBOARD_URL =
  'https://redash.sovryn.app/api/queries/544/results.json?api_key=52Jy2PGF5HZVye97NCG9e8nNDDPZ1iFo65Hfo1sk';

export const STAKING_LEADERBOARD_URL =
  'https://redash.sovryn.app/api/queries/545/results.json?api_key=sjTLMq48pU0yHJlDBWrFiQQS2x0jTtk7BChYTC8J';

export const PAGE_SIZE = 50;

export const MAXIMUM_USERS_TO_SHOW = 500;

export const COLUMNS_CONFIG = (isSingleUser: boolean) => [
  {
    id: '',
    title: isSingleUser
      ? t(translations.leaderboardPage.tables.baseTable.yourPosition)
      : '',
    cellRenderer: (row: User) => row.rank,
  },
  {
    id: isSingleUser ? '' : 'wallet',
    title: isSingleUser
      ? ''
      : t(translations.leaderboardPage.tables.baseTable.participant),
    cellRenderer: (row: User) => (
      <div>
        <div>{prettyTx(row.wallet)}</div>
        <div className="flex-wrap gap-y-1">
          <Badges user={row} />
        </div>
      </div>
    ),
  },
  {
    id: 'points',
    title: t(translations.leaderboardPage.tables.baseTable.points),
    cellRenderer: (row: User) => (
      <AmountRenderer value={row.points} showRoundingPrefix={false} />
    ),
  },
];
