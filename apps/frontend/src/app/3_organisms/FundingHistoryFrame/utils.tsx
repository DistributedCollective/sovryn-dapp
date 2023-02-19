import React from 'react';

import { t } from 'i18next';

import { Paragraph, ParagraphSize, TransactionId } from '@sovryn/ui';

import { AmountRenderer } from '../../2_molecules/AmountRenderer/AmountRenderer';
import { translations } from '../../../locales/i18n';
import { Bitcoin } from '../../../utils/constants';
import { BitcoinTransferDirection } from '../../../utils/graphql/rsk/generated';
import {
  dateFormat,
  getBtcExplorerUrl,
  getRskExplorerUrl,
} from '../../../utils/helpers';
import { FundingHistoryType } from './types';

export const generateRowTitle = (item: FundingHistoryType) => (
  <Paragraph size={ParagraphSize.small}>
    {transactionTypeRenderer(item)}
    {' - '}
    {dateFormat(item.timestamp)}
  </Paragraph>
);

const rskExplorerUrl = getRskExplorerUrl();
const btcExplorerUrl = getBtcExplorerUrl();

const transactionTypeRenderer = (item: FundingHistoryType) => {
  const type = t(
    translations.fundingHistory.transactionType[
      item.type === BitcoinTransferDirection.Outgoing ? 'withdraw' : 'deposit'
    ][`part${item.order}`],
  );
  return type;
};

const renderSentAmount = (item: FundingHistoryType) => (
  <AmountRenderer
    value={item.sent}
    suffix={Bitcoin}
    precision={8}
    dataAttribute="funding-history-sent"
  />
);

const renderReceivedAmount = (item: FundingHistoryType) => (
  <AmountRenderer
    value={item.received}
    suffix={Bitcoin}
    precision={8}
    dataAttribute="funding-history-received"
  />
);

const renderServiceFee = (item: FundingHistoryType) => (
  <AmountRenderer
    value={item.serviceFee}
    suffix={Bitcoin}
    precision={8}
    dataAttribute="funding-history-service-fee"
  />
);

const renderTXID = (item: FundingHistoryType) => {
  const href =
    (item.type === BitcoinTransferDirection.Outgoing && item.order === 2) ||
    (item.type === BitcoinTransferDirection.Incoming && item.order === 1)
      ? `${rskExplorerUrl}/tx/${item.txHash}`
      : `${btcExplorerUrl}/tx/${item.txHash}`;

  return (
    <TransactionId
      href={href}
      value={item.txHash}
      dataAttribute="funding-history-address-id"
    />
  );
};

export const columnsConfig = [
  {
    id: 'updatedAtTimestamp',
    title: t(translations.fundingHistory.table.timestamp),
    cellRenderer: (item: FundingHistoryType) => dateFormat(item.timestamp),
    sortable: true,
  },
  {
    id: 'transactionType',
    title: t(translations.fundingHistory.table.transactionType),
    cellRenderer: transactionTypeRenderer,
  },
  {
    id: 'sent',
    title: t(translations.fundingHistory.table.sent),
    cellRenderer: renderSentAmount,
  },
  {
    id: 'received',
    title: t(translations.fundingHistory.table.received),
    cellRenderer: renderReceivedAmount,
  },
  {
    id: 'serviceFee',
    title: t(translations.fundingHistory.table.serviceFee),
    cellRenderer: renderServiceFee,
  },
  {
    id: 'txId',
    title: t(translations.fundingHistory.table.txId),
    cellRenderer: renderTXID,
  },
];
