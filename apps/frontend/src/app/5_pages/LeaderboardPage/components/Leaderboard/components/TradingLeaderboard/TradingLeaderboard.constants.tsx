import React from 'react';

import { t } from 'i18next';

import { translations } from '../../../../../../../locales/i18n';
import { prettyTx } from '../../../../../../../utils/helpers';
import { Badges } from '../../Badges/Badges';
import { User } from '../../Leaderboard.types';

export const TRADING_LEADERBOARD_URL =
  'http://redash.sovryn.app/api/queries/544/results.json?api_key=52Jy2PGF5HZVye97NCG9e8nNDDPZ1iFo65Hfo1sk';

// TODO: Move somewhere else
export const STAKING_LEADERBOARD_URL =
  'http://redash.sovryn.app/api/queries/545/results.json?api_key=sjTLMq48pU0yHJlDBWrFiQQS2x0jTtk7BChYTC8J';

export const COLUMNS_CONFIG = [
  {
    id: '',
    title: '',
    cellRenderer: (row: User) => <span>{row.rank}</span>,
  },
  {
    id: 'wallet',
    title: t(translations.leaderboardPage.tables.trading.participants),
    cellRenderer: (row: User) => (
      <div className="flex items-center">
        <div className="mr-4">{prettyTx(row.wallet)}</div>
        <Badges user={row} />
      </div>
    ),
  },
  {
    id: 'points',
    title: t(translations.leaderboardPage.tables.trading.points),
    cellRenderer: (row: User) => <span>{row.points}</span>,
  },
];
