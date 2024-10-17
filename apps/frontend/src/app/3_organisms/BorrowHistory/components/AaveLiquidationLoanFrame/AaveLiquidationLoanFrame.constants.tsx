import React from 'react';

import { t } from 'i18next';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { AssetRenderer } from '../../../../2_molecules/AssetRenderer/AssetRenderer';
import { TxIdWithNotification } from '../../../../2_molecules/TxIdWithNotification/TransactionIdWithNotification';
import { translations } from '../../../../../locales/i18n';
import { dateFormat, getBobExplorerUrl } from '../../../../../utils/helpers';
import { LiquidationHistoryItem } from './AaveLiquidationLoanFrame.types';

export const COLUMNS = [
  {
    id: 'timestamp',
    title: t(translations.common.tables.columnTitles.timestamp),
    cellRenderer: (tx: LiquidationHistoryItem) => dateFormat(tx.timestamp),
    sortable: true,
  },
  {
    id: 'transactionType',
    title: t(translations.common.tables.columnTitles.transactionType),
    cellRenderer: () => t(translations.borrowHistory.transactionTypes.repay),
  },
  {
    id: 'collateralToken',
    title: t(translations.loanHistory.table.collateralLiquidated),
    cellRenderer: (tx: LiquidationHistoryItem) => tx.collateralReserve.symbol,
  },
  {
    id: 'collateralAmount',
    title: t(translations.loanHistory.table.collateralAmount),
    cellRenderer: (tx: LiquidationHistoryItem) => (
      <div className="inline-flex gap-1 items-center">
        <AmountRenderer
          value={tx.collateralAmount}
          precision={2}
          dataAttribute="borrow-liquidation"
        />
        <AssetRenderer asset={tx.collateralReserve.symbol} />
      </div>
    ),
  },
  {
    id: 'debtToken',
    title: t(translations.loanHistory.table.debtRepaid),
    cellRenderer: (tx: LiquidationHistoryItem) => tx.debtReserve.symbol,
  },
  {
    id: 'debtAmount',
    title: t(translations.loanHistory.table.debtRepaid),
    cellRenderer: (tx: LiquidationHistoryItem) => (
      <div className="inline-flex gap-1 items-center">
        <AmountRenderer
          value={tx.debtAmount}
          precision={2}
          dataAttribute="borrow-liquidation"
        />
        <AssetRenderer asset={tx.debtReserve.symbol} />
      </div>
    ),
  },
  {
    id: 'transactionID',
    title: t(translations.common.tables.columnTitles.transactionID),
    cellRenderer: (tx: LiquidationHistoryItem) => (
      <TxIdWithNotification
        href={`${getBobExplorerUrl()}/tx/${tx.hash}`}
        value={tx.hash}
        dataAttribute="transaction-id"
      />
    ),
  },
];
