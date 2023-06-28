import React from 'react';

import { t } from 'i18next';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { TransactionIdRenderer } from '../../../../2_molecules/TransactionIdRenderer/TransactionIdRenderer';
import {
  BITCOIN,
  BTC_RENDER_PRECISION,
} from '../../../../../constants/currencies';
import { translations } from '../../../../../locales/i18n';
import { Swap } from '../../../../../utils/graphql/rsk/generated';
import { dateFormat } from '../../../../../utils/helpers';

const renderConversionFee = (swap: Swap) => (
  <AmountRenderer
    value={swap.conversionFee || '0'}
    suffix={BITCOIN}
    precision={BTC_RENDER_PRECISION}
    dataAttribute="amm-history-fee"
  />
);

export const COLUMNS_CONFIG = [
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
    id: 'conversionFee',
    title: t(translations.conversionsHistory.table.conversionFee),
    cellRenderer: renderConversionFee,
  },
  {
    id: 'transactionId',
    title: t(translations.common.tables.columnTitles.transactionID),
    cellRenderer: (item: Swap) => (
      <TransactionIdRenderer hash={item.transaction.id} />
    ),
  },
];
