import React from 'react';

import { t } from 'i18next';

import { Paragraph, ParagraphSize } from '@sovryn/ui';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { masset } from '../../../../5_pages/ConvertPage/ConvertPage.types';
import { TOKEN_RENDER_PRECISION } from '../../../../../constants/currencies';
import { translations } from '../../../../../locales/i18n';
import {
  Conversion,
  ConversionType,
} from '../../../../../utils/graphql/mynt/generated';
import { dateFormat } from '../../../../../utils/helpers';
import { TransactionIdRenderer } from '../TransactionIdRenderer/TransactionIdRenderer';

const sentAmountRenderer = (item: Conversion) => {
  const isIncomingTransaction = item.type === ConversionType.Incoming; // bAsset -> mAsset

  const amount = isIncomingTransaction
    ? item.bassetQuantity
    : item.massetQuantity;
  const asset = isIncomingTransaction
    ? item.bAsset.symbol
    : masset.toUpperCase();

  return <AmountRenderer value={amount} suffix={asset!} />;
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
      precision={TOKEN_RENDER_PRECISION}
    />
  );
};

export const columnsConfig = [
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

export const generateRowTitle = (item: Conversion) => (
  <Paragraph size={ParagraphSize.small} className="text-left">
    {`${t(translations.conversionsHistory.type)} - ${dateFormat(
      item.transaction.timestamp,
    )}`}
  </Paragraph>
);
