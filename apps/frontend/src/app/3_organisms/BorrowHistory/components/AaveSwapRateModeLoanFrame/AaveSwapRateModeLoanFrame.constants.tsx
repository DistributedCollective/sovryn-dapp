import React from 'react';

import { t } from 'i18next';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { TxIdWithNotification } from '../../../../2_molecules/TxIdWithNotification/TransactionIdWithNotification';
import { translations } from '../../../../../locales/i18n';
import { dateFormat, getBobExplorerUrl } from '../../../../../utils/helpers';
import { SwapBorrowRateModeHistoryItem } from './AaveSwapRateModeLoanFrame.types';

export const COLUMNS = [
  {
    id: 'timestamp',
    title: t(translations.common.tables.columnTitles.timestamp),
    cellRenderer: (tx: SwapBorrowRateModeHistoryItem) =>
      dateFormat(tx.timestamp),
    sortable: true,
  },
  {
    id: 'transactionType',
    title: t(translations.common.tables.columnTitles.transactionType),
    cellRenderer: () =>
      t(translations.borrowHistory.transactionTypes.swapBorrowRateMode),
  },
  {
    id: 'reserve',
    title: t(translations.loanHistory.table.reserve),
    cellRenderer: (tx: SwapBorrowRateModeHistoryItem) => tx.reserve.symbol,
  },
  {
    id: 'from',
    title: t(translations.loanHistory.table.from),
    cellRenderer: (tx: SwapBorrowRateModeHistoryItem) => tx.from,
  },
  {
    id: 'to',
    title: t(translations.loanHistory.table.to),
    cellRenderer: (tx: SwapBorrowRateModeHistoryItem) => tx.to,
  },
  {
    id: 'variableBorrowRate',
    title: t(translations.loanHistory.table.variableBorrowRate),
    cellRenderer: (tx: SwapBorrowRateModeHistoryItem) => (
      <AmountRenderer value={tx.variableBorrowRate} precision={2} suffix="%" />
    ),
  },
  {
    id: 'interestRate',
    title: t(translations.loanHistory.table.stableBorrowRate),
    cellRenderer: (tx: SwapBorrowRateModeHistoryItem) => (
      <AmountRenderer value={tx.stableBorrowRate} precision={2} suffix="%" />
    ),
  },
  {
    id: 'transactionID',
    title: t(translations.common.tables.columnTitles.transactionID),
    cellRenderer: (tx: SwapBorrowRateModeHistoryItem) => (
      <TxIdWithNotification
        href={`${getBobExplorerUrl()}/tx/${tx.hash}`}
        value={tx.hash}
        dataAttribute="transaction-id"
      />
    ),
  },
];
