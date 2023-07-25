import React from 'react';

import { t } from 'i18next';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { TransactionIdRenderer } from '../../../../2_molecules/TransactionIdRenderer/TransactionIdRenderer';
import { translations } from '../../../../../locales/i18n';
import { LendingHistoryType } from '../../../../../utils/graphql/rsk/generated';
import { dateFormat } from '../../../../../utils/helpers';
import { decimalic } from '../../../../../utils/math';
import { LendingEvent } from './LendingHistoryFrame.types';
import { getTransactionType } from './LendingHistoryFrame.utils';

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
    cellRenderer: (item: LendingEvent) => (
      <>
        <AmountRenderer
          value={
            item.type === LendingHistoryType.UnLend
              ? decimalic(item.amount).mul(-1)
              : decimalic(item.amount)
          }
        />
      </>
    ),
  },
  {
    id: 'transactionId',
    title: t(translations.common.tables.columnTitles.transactionID),
    cellRenderer: (item: LendingEvent) => (
      <TransactionIdRenderer hash={item.transactionHash} />
    ),
  },
];
