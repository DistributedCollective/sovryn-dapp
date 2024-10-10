// import React from 'react';

// import { t } from 'i18next';

// import { Paragraph, ParagraphSize, TransactionId } from '@sovryn/ui';

// import { AmountRenderer } from '../../2_molecules/AmountRenderer/AmountRenderer';
// import { BITCOIN } from '../../../constants/currencies';
// import { translations } from '../../../locales/i18n';
// import {
//   BitcoinTransferDirection,
// } from '../../../utils/graphql/rsk/generated';
// import {
//   dateFormat,
//   getBobExplorerUrl,
// } from '../../../utils/helpers';
// import { AaveHistoryType } from './AaveHistoryFrame.types';

// export const generateRowTitle = (item: AaveHistoryType) => (
//   <Paragraph size={ParagraphSize.small} className="text-left">
//     {transactionTypeRenderer(item)}
//     {' - '}
//     {dateFormat(item.timestamp)}
//   </Paragraph>
// );

// export const transactionTypeRenderer = (item: AaveHistoryType) => {
//   const type = t(
//     translations.fundingHistory.transactionType[
//       item.type === BitcoinTransferDirection.Outgoing ? 'withdraw' : 'deposit'
//     ][`part${item.order}`],
//   );
//   return type;
// };

// const renderAmount = (item: AaveHistoryType) => {
//   if (item.amount === '-') {
//     return '⁠—';
//   }

//   return (
//     <AmountRenderer
//       value={item.amount}
//       suffix={item.symbol}
//       precision={item.decimals}
//       dataAttribute="aave-history-amount"
//     />
//   );
// };

// const renderTXID = (item: AaveHistoryType) => {
//   if (!item.txHash) {
//     return '⁠—';
//   }

//   const href = `${getBobExplorerUrl()}/tx/${item.txHash}`;

//   return (
//     <TransactionId
//       href={href}
//       value={item.txHash}
//       dataAttribute="aave-history-tx-hash"
//     />
//   );
// };

// export const columnsConfig = [
//   {
//     id: 'createdAtTimestamp',
//     title: t(translations.common.tables.columnTitles.timestamp),
//     cellRenderer: (item: AaveHistoryType) => dateFormat(item.timestamp),
//     sortable: true,
//   },
//   {
//     id: 'transactionType',
//     title: t(translations.common.tables.columnTitles.transactionType),
//     cellRenderer: transactionTypeRenderer,
//   },
//   {
//     id: 'sent',
//     title: t(translations.fundingHistory.table.sent),
//     cellRenderer: renderSentAmount,
//   },
//   {
//     id: 'received',
//     title: t(translations.fundingHistory.table.received),
//     cellRenderer: renderAmount,
//   },
//   {
//     id: 'serviceFee',
//     title: t(translations.fundingHistory.table.serviceFee),
//     cellRenderer: renderServiceFee,
//   },
//   {
//     id: 'txId',
//     title: t(translations.common.tables.columnTitles.transactionID),
//     cellRenderer: renderTXID,
//   },
// ];

export const columnsConfig = [];
