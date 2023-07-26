import React from 'react';

import { t } from 'i18next';

import { TransactionIdRenderer } from '../../../../2_molecules/TransactionIdRenderer/TransactionIdRenderer';
import { translations } from '../../../../../locales/i18n';
import { dateFormat } from '../../../../../utils/helpers';
import { LendingEvent } from './LendingHistoryFrame.types';
import { getTransactionType } from './LendingHistoryFrame.utils';
import { BalanceChange } from './components/BalanceChange';

export const COLUMNS_CONFIG = [
  {
    id: 'timestamp',
    title: t(translations.common.tables.columnTitles.timestamp),
    cellRenderer: (item: LendingEvent) => <>{dateFormat(item.timestamp)}</>,
    sortable: true,
  },
  {
    id: 'transactionType',
    title: t(translations.common.tables.columnTitles.transactionType),
    cellRenderer: (item: LendingEvent) => <>{getTransactionType(item.type)}</>,
  },
  {
    id: 'balanceChange',
    title: t(translations.earnHistory.lendingHistory.columns.balanceChange),
    cellRenderer: (item: LendingEvent) => <BalanceChange item={item} />,
  },
  {
    id: 'transactionId',
    title: t(translations.common.tables.columnTitles.transactionID),
    cellRenderer: (item: LendingEvent) => (
      <TransactionIdRenderer hash={item.transactionHash} />
    ),
  },
];
