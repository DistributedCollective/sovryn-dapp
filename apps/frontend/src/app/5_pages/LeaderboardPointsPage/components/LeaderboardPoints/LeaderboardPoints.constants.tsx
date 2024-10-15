import React from 'react';

import { ethers } from 'ethers';
import { t } from 'i18next';

import { prettyTx } from '@sovryn/ui';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { translations } from '../../../../../locales/i18n';

export const DATA_ENDPOINT_URL =
  'https://season2-spice-points-bucket.s3.us-east-2.amazonaws.com/Total_S1&S2_Spice_Leaderboard.json';

export const S3_DATA_ENDPOINT_URL =
  'https://season2-spice-points-bucket.s3.us-east-2.amazonaws.com/Total_S3_Spice_Leaderboard.json';

export const PAGE_SIZE = 50;

export const COLUMNS_CONFIG = (isSingleUser: boolean = false) => [
  {
    id: '',
    title: '',
    cellRenderer: user => user.id,
    className: 'w-24 invisible lg:visible h-0 lg:h-auto',
  },
  {
    id: '',
    title: isSingleUser
      ? t(translations.leaderboardPointsPage.table.yourPosition)
      : t(translations.leaderboardPointsPage.table.participant),
    cellRenderer: user => (
      <div className="text-right lg:text-left w-full">
        {prettyTx(user.wallet, 4)}
      </div>
    ),
    sampleData: prettyTx(ethers.constants.AddressZero, 4),
  },
  {
    id: '',
    title: t(translations.leaderboardPointsPage.table.spice),
    cellRenderer: user => <AmountRenderer value={user.points} />,
    sampleData: '111,111,111.1111',
  },
  {
    id: '',
    title: t(translations.leaderboardPointsPage.table.spice3),
    cellRenderer: user => <AmountRenderer value={user.s3Points} />,
    sampleData: '111,111,111.1111',
  },
  {
    id: '',
    title: t(translations.leaderboardPointsPage.table.total),
    cellRenderer: user => <AmountRenderer value={user.total} />,
    sampleData: '111,111,111.1111',
  },
];
