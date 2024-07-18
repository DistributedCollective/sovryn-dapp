import React from 'react';

import { t } from 'i18next';

import { prettyTx } from '@sovryn/ui';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { translations } from '../../../../../locales/i18n';

export const DATA_ENDPOINT_URL =
  'https://season2-spice-points-bucket.s3.us-east-2.amazonaws.com/latest_Season2_Spice_distributed.json';

export const PAGE_SIZE = 50;

export const COLUMNS_CONFIG = (isSingleUser: boolean = false) => [
  {
    id: isSingleUser ? 'position' : '',
    title: isSingleUser
      ? t(translations.leaderboardPointsPage.table.yourPosition)
      : '',
    cellRenderer: user => user.id,
  },
  {
    id: isSingleUser ? '' : 'wallet',
    title: isSingleUser
      ? ''
      : t(translations.leaderboardPointsPage.table.participant),
    cellRenderer: user => (
      <div className="text-right lg:text-left w-full">
        {prettyTx(user.wallet, 4)}
      </div>
    ),
  },
  {
    id: 'points',
    title: t(translations.leaderboardPointsPage.table.points),
    cellRenderer: user => <AmountRenderer value={user.points} />,
  },
];
