import React from 'react';

import { t } from 'i18next';

import { TransactionIdRenderer } from '../../../../2_molecules/TransactionIdRenderer/TransactionIdRenderer';
import { translations } from '../../../../../locales/i18n';
import { LiquidityHistoryItem } from '../../../../../utils/graphql/rsk/generated';
import { dateFormat } from '../../../../../utils/helpers';
import {
  getTransactionType,
  renderBalanceChange,
} from './MarketMakingHistory.utils';

export const COLUMNS_CONFIG = [
  {
    id: 'timestamp',
    title: t(translations.common.tables.columnTitles.timestamp),
    cellRenderer: (item: LiquidityHistoryItem) => (
      <>{dateFormat(item.timestamp)}</>
    ),
    sortable: true,
  },
  {
    id: 'transactionType',
    title: t(translations.common.tables.columnTitles.transactionType),
    cellRenderer: (item: LiquidityHistoryItem) => (
      <>{getTransactionType(item)}</>
    ),
  },
  {
    id: 'balanceChange',
    title: t(
      translations.earnHistory.marketMakingHistory.columns.balanceChange,
    ),
    cellRenderer: (item: LiquidityHistoryItem) => renderBalanceChange(item),
  },
  {
    id: 'transactionId',
    title: t(translations.common.tables.columnTitles.transactionID),
    cellRenderer: (item: LiquidityHistoryItem) => (
      <TransactionIdRenderer hash={item.transaction.id} />
    ),
  },
];
