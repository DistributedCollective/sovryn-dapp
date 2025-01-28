import {
  GatewayOrder,
  GatewayTokensInfo,
} from '@gobob/bob-sdk/dist/gateway/types';

import React from 'react';

import { formatUnits } from 'ethers/lib/utils';
import { t } from 'i18next';

import { TxIdWithNotification } from '../../../../2_molecules/TxIdWithNotification/TransactionIdWithNotification';
import { translations } from '../../../../../locales/i18n';
import { dateFormat } from '../../../../../utils/helpers';

type Order = GatewayOrder & GatewayTokensInfo;

export const COLUMNS_CONFIG = [
  {
    id: 'timestamp',
    title: t(translations.common.tables.columnTitles.timestamp),
    cellRenderer: (tx: Order) => dateFormat(tx.timestamp),
  },
  {
    id: 'baseToken',
    title: t(translations.bobGatewayPage.orderTable.baseToken),
    cellRenderer: (tx: Order) => tx.baseToken.symbol,
  },
  {
    id: 'outputToken',
    title: t(translations.bobGatewayPage.orderTable.outputToken),
    cellRenderer: (tx: Order) => tx.outputToken?.symbol,
  },
  {
    id: 'amount',
    title: t(translations.bobGatewayPage.orderTable.amount),
    cellRenderer: (tx: Order) => formatUnits(tx.tokens, 8),
  },
  {
    id: 'status',
    title: t(translations.bobGatewayPage.orderTable.status),
    cellRenderer: (tx: Order) =>
      tx.status
        ? t(translations.bobGatewayPage.orderTable.confirmed)
        : t(translations.bobGatewayPage.orderTable.pending),
  },
  {
    id: 'gatewayAddress',
    title: t(translations.bobGatewayPage.orderTable.gatewayAddress),
    cellRenderer: (tx: Order) => (
      <TxIdWithNotification href="" value={tx.gatewayAddress} />
    ),
  },
  {
    id: 'strategyAddress',
    title: t(translations.bobGatewayPage.orderTable.strategyAddress),
    cellRenderer: (tx: Order) => (
      <TxIdWithNotification href="" value={tx.strategyAddress || ''} />
    ),
  },
  {
    id: 'txHash',
    title: t(translations.bobGatewayPage.orderTable.txHash),
    cellRenderer: (tx: Order) => (
      <TxIdWithNotification href="" value={tx.txHash || ''} />
    ),
  },
];
