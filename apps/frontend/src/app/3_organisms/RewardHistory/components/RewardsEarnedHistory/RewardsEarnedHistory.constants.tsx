import React from 'react';

import { t } from 'i18next';

import { TransactionIdRenderer } from '../../../../2_molecules/TransactionIdRenderer/TransactionIdRenderer';
import { translations } from '../../../../../locales/i18n';
import { RewardsEarnedHistoryItem } from '../../../../../utils/graphql/rsk/generated';
import { dateFormat } from '../../../../../utils/helpers';
import { getTransactionType } from './RewardsEarnedHistory.utils';
import { RewardsAmountRenderer } from './components/RewardsAmountRenderer';

export const COLUMNS_CONFIG = [
  {
    id: 'timestamp',
    title: t(translations.common.tables.columnTitles.timestamp),
    cellRenderer: (tx: RewardsEarnedHistoryItem) => dateFormat(tx.timestamp),
    sortable: true,
  },
  {
    id: 'stabilityPoolOperation',
    title: t(translations.common.tables.columnTitles.transactionType),
    cellRenderer: (tx: RewardsEarnedHistoryItem) =>
      getTransactionType(tx.action),
  },
  {
    id: 'amount',
    title: t(translations.common.tables.columnTitles.amount),
    cellRenderer: (tx: RewardsEarnedHistoryItem) => (
      <RewardsAmountRenderer {...tx} />
    ),
  },
  {
    id: 'transactionID',
    title: t(translations.common.tables.columnTitles.transactionID),
    cellRenderer: (tx: RewardsEarnedHistoryItem) => (
      <TransactionIdRenderer
        hash={tx.id.split('/')[0]}
        dataAttribute="reward-earned-history-tx-hash"
      />
    ),
  },
];
