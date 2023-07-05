import React from 'react';

import { t } from 'i18next';

import { TransactionIdRenderer } from '../../../../2_molecules/TransactionIdRenderer/TransactionIdRenderer';
import { translations } from '../../../../../locales/i18n';
import {
  Conversion,
  ConversionType,
} from '../../../../../utils/graphql/mynt/generated';
import { dateFormat } from '../../../../../utils/helpers';
import {
  receivedAmountRenderer,
  sentAmountRenderer,
} from './MyntConversionsHistoryFrame.utils';

export const COLUMNS_CONFIG = [
  {
    id: 'timestamp',
    title: t(translations.common.tables.columnTitles.timestamp),
    cellRenderer: (item: Conversion) => (
      <>{dateFormat(item.transaction.timestamp)}</>
    ),
    sortable: true,
  },
  {
    id: 'transactionType',
    title: t(translations.common.tables.columnTitles.transactionType),
    cellRenderer: (item: Conversion) => (
      <>
        {item.type === ConversionType.Incoming
          ? t(translations.conversionsHistory.mint)
          : t(translations.conversionsHistory.burn)}
      </>
    ),
  },
  {
    id: 'sent',
    title: t(translations.conversionsHistory.table.sent),
    cellRenderer: sentAmountRenderer,
  },
  {
    id: 'received',
    title: t(translations.conversionsHistory.table.received),
    cellRenderer: receivedAmountRenderer,
  },
  {
    id: 'transactionId',
    title: t(translations.common.tables.columnTitles.transactionID),
    cellRenderer: (item: Conversion) => (
      <TransactionIdRenderer hash={item.transaction.id} />
    ),
  },
];
