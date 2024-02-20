import React from 'react';

import { t } from 'i18next';

import { AmountRenderer } from '../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { translations } from '../../../../../../../locales/i18n';
import { prettyTx } from '../../../../../../../utils/helpers';
import { Badges } from '../../Badges/Badges';
import { User } from '../../Leaderboard.types';

export const TRADING_LEADERBOARD_URL =
  'https://redash.sovryn.app/api/queries/544/results.json?api_key=52Jy2PGF5HZVye97NCG9e8nNDDPZ1iFo65Hfo1sk';

// TODO: Move somewhere else
export const STAKING_LEADERBOARD_URL =
  'https://redash.sovryn.app/api/queries/545/results.json?api_key=sjTLMq48pU0yHJlDBWrFiQQS2x0jTtk7BChYTC8J';

export const COLUMNS_CONFIG = (isSingleUser: boolean) => [
  {
    id: '',
    title: '',
    cellRenderer: (row: User) => <div>{row.rank}</div>,
  },
  {
    id: 'wallet',
    title: t(
      translations.leaderboardPage.tables.trading[
        isSingleUser ? 'yourPosition' : 'participants'
      ],
    ),
    cellRenderer: (row: User) => (
      <div className="flex items-center">
        <div className="mr-4">{prettyTx(row.wallet)}</div>
        <div className="flex-wrap gap-y-1">
          <Badges user={row} />
        </div>
      </div>
    ),
  },
  {
    id: 'points',
    title: t(translations.leaderboardPage.tables.trading.points),
    cellRenderer: (row: User) => (
      <AmountRenderer value={row.points} showRoundingPrefix={false} />
    ),
  },
];
