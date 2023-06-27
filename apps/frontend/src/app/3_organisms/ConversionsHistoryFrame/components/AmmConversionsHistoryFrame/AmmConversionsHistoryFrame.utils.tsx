import React from 'react';

import { t } from 'i18next';

import { Paragraph, ParagraphSize } from '@sovryn/ui';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { translations } from '../../../../../locales/i18n';
import { Swap } from '../../../../../utils/graphql/rsk/generated';
import { dateFormat } from '../../../../../utils/helpers';
import { TransactionIdRenderer } from '../../components/TransactionIdRenderer/TransactionIdRenderer';

export const columnsConfig = [
  {
    id: 'timestamp',
    title: t(translations.common.tables.columnTitles.timestamp),
    cellRenderer: (item: Swap) => <>{dateFormat(item.transaction.timestamp)}</>,
    sortable: true,
  },
  {
    id: 'transactionType',
    title: t(translations.common.tables.columnTitles.transactionType),
    cellRenderer: () => <>{t(translations.conversionsHistory.swap)}</>,
  },
  {
    id: 'sent',
    title: t(translations.conversionsHistory.table.sent),
    cellRenderer: (item: Swap) => (
      <AmountRenderer value={item.fromAmount} suffix={item.fromToken.symbol!} />
    ),
  },
  {
    id: 'received',
    title: t(translations.conversionsHistory.table.received),
    cellRenderer: (item: Swap) => (
      <AmountRenderer value={item.toAmount} suffix={item.toToken.symbol!} />
    ),
  },
  {
    id: 'transactionId',
    title: t(translations.common.tables.columnTitles.transactionID),
    cellRenderer: (item: Swap) => (
      <TransactionIdRenderer hash={item.transaction.id} />
    ),
  },
];

export const generateRowTitle = (item: Swap) => (
  <Paragraph size={ParagraphSize.small} className="text-left">
    {`${t(translations.conversionsHistory.type)} - ${dateFormat(
      item.transaction.timestamp,
    )}`}
  </Paragraph>
);
