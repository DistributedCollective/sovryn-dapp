import React from 'react';

import { t } from 'i18next';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { TransactionIdRenderer } from '../../../../2_molecules/TransactionIdRenderer/TransactionIdRenderer';
import { TOKEN_RENDER_PRECISION } from '../../../../../constants/currencies';
import { translations } from '../../../../../locales/i18n';
import { COMMON_SYMBOLS } from '../../../../../utils/asset';
import { VestingHistoryItem } from '../../../../../utils/graphql/rsk/generated';
import { dateFormat } from '../../../../../utils/helpers';
import { getTransactionType } from './VestingRewards.utils';

const renderAmount = (item: VestingHistoryItem) => {
  if (item.amount === '-') {
    return '⁠—';
  }

  return (
    <AmountRenderer
      value={item.amount}
      suffix={COMMON_SYMBOLS.SOV}
      precision={TOKEN_RENDER_PRECISION}
      dataAttribute="vesting-reward-history-amount"
    />
  );
};

export const COLUMNS_CONFIG = [
  {
    id: 'timestamp',
    title: t(translations.common.tables.columnTitles.timestamp),
    cellRenderer: (tx: VestingHistoryItem) => dateFormat(tx.timestamp),
    sortable: true,
  },
  {
    id: 'action',
    title: t(translations.common.tables.columnTitles.transactionType),
    cellRenderer: (tx: VestingHistoryItem) => getTransactionType(tx.action),
  },
  {
    id: 'amount',
    title: t(translations.common.tables.columnTitles.amount),
    cellRenderer: renderAmount,
  },
  {
    id: 'transactionID',
    title: t(translations.common.tables.columnTitles.transactionID),
    cellRenderer: (tx: VestingHistoryItem) => (
      <TransactionIdRenderer
        hash={tx.transaction.id}
        dataAttribute="vesting-reward-history-tx-hash"
      />
    ),
  },
];
