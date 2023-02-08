import React from 'react';

import { t } from 'i18next';

import { Paragraph, ParagraphSize, TransactionId } from '@sovryn/ui';

import { chains, defaultChainId } from '../../../config/chains';

import { masset } from '../../5_pages/ConvertPage/ConvertPage.types';
import { translations } from '../../../locales/i18n';
import {
  Conversion,
  ConversionType,
} from '../../../utils/graphql/mynt/generated';
import { dateFormat } from '../../../utils/helpers';
import { AssetAmountCell } from './components/AssetAmountCell/AssetAmountCell';

const sentAmountRenderer = (item: Conversion) => {
  const isIncomingTransaction = item.type === ConversionType.Incoming; // bAsset -> mAsset

  const amount = isIncomingTransaction
    ? item.bassetQuantity
    : item.massetQuantity;
  const asset = isIncomingTransaction
    ? item.bAsset.symbol
    : masset.toUpperCase();

  return <AssetAmountCell amount={amount} asset={asset!} />;
};

const receivedAmountRenderer = (item: Conversion) => {
  const isIncomingTransaction = item.type === ConversionType.Incoming; // bAsset -> mAsset

  const amount = isIncomingTransaction
    ? item.massetQuantity
    : item.bassetQuantity;
  const asset = isIncomingTransaction
    ? masset.toUpperCase()
    : item.bAsset.symbol;

  return <AssetAmountCell amount={amount} asset={asset!} />;
};

const transactionIdRenderer = (item: Conversion) => {
  const chain = chains.find(chain => chain.id === defaultChainId);

  return (
    <TransactionId
      href={`${chain?.blockExplorerUrl}/tx/${item.transaction.id}`}
      value={item.transaction.id}
      dataAttribute="conversion-history-address-id"
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
    cellRenderer: transactionIdRenderer,
  },
];

export const generateRowTitle = (item: Conversion) => (
  <Paragraph size={ParagraphSize.small}>
    {`${t(translations.conversionsHistory.type)} - ${dateFormat(
      item.transaction.timestamp,
    )}`}
  </Paragraph>
);
