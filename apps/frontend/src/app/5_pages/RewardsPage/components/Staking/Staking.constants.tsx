import React from 'react';

import { t } from 'i18next';

import { translations } from '../../../../../locales/i18n';

export const MAX_LIQUID_STAKES = 33;

export const columns = [
  {
    id: 'type',
    title: t(translations.rewardPage.stabilityPool.rewardType),
    cellRenderer: row => row.type,
  },
  {
    id: 'amount',
    title: t(translations.common.amount),
    cellRenderer: row => row.amount,
  },
  {
    id: 'action',
    title: <></>,
    cellRenderer: row => row.action,
  },
];
