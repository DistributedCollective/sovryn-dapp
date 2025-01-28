import React from 'react';

import { t } from 'i18next';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { AssetRenderer } from '../../../../2_molecules/AssetRenderer/AssetRenderer';
import { TxIdWithNotification } from '../../../../2_molecules/TxIdWithNotification/TransactionIdWithNotification';
import { translations } from '../../../../../locales/i18n';
import { dateFormat, getBobExplorerUrl } from '../../../../../utils/helpers';
import { NewBorrowHistoryItem } from './AaveNewLoanHistoryFrame.types';

export const COLUMNS = [
  {
    id: 'timestamp',
    title: t(translations.common.tables.columnTitles.timestamp),
    cellRenderer: (tx: NewBorrowHistoryItem) => dateFormat(tx.timestamp),
    sortable: true,
  },
  {
    id: 'transactionType',
    title: t(translations.common.tables.columnTitles.transactionType),
    cellRenderer: () =>
      t(translations.borrowHistory.transactionTypes.createLoan),
  },
  {
    id: 'debtAmount',
    title: t(translations.loanHistory.table.debtAmount),
    cellRenderer: (tx: NewBorrowHistoryItem) => (
      <div className="inline-flex gap-1 items-center">
        <AmountRenderer
          value={tx.amount}
          precision={2}
          dataAttribute="borrow-new-debt"
        />
        <AssetRenderer asset={tx.reserve.symbol} />
      </div>
    ),
  },
  {
    id: 'interestRate',
    title: t(translations.loanHistory.table.interestRate),
    cellRenderer: (tx: NewBorrowHistoryItem) => (
      <AmountRenderer value={tx.borrowRate} precision={2} suffix="%" />
    ),
  },
  {
    id: 'interestRateMode',
    title: t(translations.loanHistory.table.interestRateMode),
    cellRenderer: (tx: NewBorrowHistoryItem) => (
      <span>{tx.borrowRateMode}</span>
    ),
  },
  {
    id: 'transactionID',
    title: t(translations.common.tables.columnTitles.transactionID),
    cellRenderer: (tx: NewBorrowHistoryItem) => (
      <TxIdWithNotification
        href={`${getBobExplorerUrl()}/tx/${tx.hash}`}
        value={tx.hash}
        dataAttribute="transaction-id"
      />
    ),
  },
];
