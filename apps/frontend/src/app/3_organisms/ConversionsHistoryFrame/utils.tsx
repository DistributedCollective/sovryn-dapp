import React from 'react';

import { t } from 'i18next';

import { Paragraph, ParagraphSize } from '@sovryn/ui';

import { AmountRenderer } from '../../2_molecules/AmountRenderer/AmountRenderer';
import { masset } from '../../5_pages/ConvertPage/ConvertPage.types';
import { translations } from '../../../locales/i18n';
import {
  Conversion,
  ConversionType,
} from '../../../utils/graphql/mynt/generated';
import { dateFormat } from '../../../utils/helpers';
import { BTC_RENDER_PRECISION } from '../ZeroLocForm/constants';
import { TransactionIdRenderer } from './components/TransactionIdRenderer/TransactionIdRenderer';

const sentAmountRenderer = (item: Conversion) => {
  const isIncomingTransaction = item.type === ConversionType.Incoming; // bAsset -> mAsset

  const amount = isIncomingTransaction
    ? item.bassetQuantity
    : item.massetQuantity;
  const asset = isIncomingTransaction
    ? item.bAsset.symbol
    : masset.toUpperCase();

  return (
    <AmountRenderer
      value={amount}
      suffix={asset!}
      precision={BTC_RENDER_PRECISION}
    />
  );
};

const receivedAmountRenderer = (item: Conversion) => {
  const isIncomingTransaction = item.type === ConversionType.Incoming; // bAsset -> mAsset

  const amount = isIncomingTransaction
    ? item.massetQuantity
    : item.bassetQuantity;
  const asset = isIncomingTransaction
    ? masset.toUpperCase()
    : item.bAsset.symbol;

  return (
    <AmountRenderer
      value={amount}
      suffix={asset!}
      precision={BTC_RENDER_PRECISION}
    />
  );
};

export const columnsConfig = [
  {
    id: 'timestamp',
    title: t(translations.conversionsHistory.table.timestamp),
    cellRenderer: (item: Conversion) => (
      <>{dateFormat(item.transaction.timestamp)}</>
    ),
    sortable: true,
  },
  {
    id: 'transactionType',
    title: t(translations.conversionsHistory.table.transactionType),
    cellRenderer: () => <>{t(translations.conversionsHistory.type)}</>,
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
    title: t(translations.conversionsHistory.table.txId),
    cellRenderer: (item: Conversion) => <TransactionIdRenderer item={item} />,
  },
];

export const generateRowTitle = (item: Conversion) => (
  <Paragraph size={ParagraphSize.small}>
    {`${t(translations.conversionsHistory.type)} - ${dateFormat(
      item.transaction.timestamp,
    )}`}
  </Paragraph>
);
