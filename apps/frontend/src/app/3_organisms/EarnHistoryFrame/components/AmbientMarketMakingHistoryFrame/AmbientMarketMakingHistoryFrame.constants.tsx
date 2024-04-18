import React from 'react';

import { t } from 'i18next';

import { TransactionIdRenderer } from '../../../../2_molecules/TransactionIdRenderer/TransactionIdRenderer';
import { getCurrentChain } from '../../../../../hooks/useChainStore';
import { translations } from '../../../../../locales/i18n';
import { LiquidityChange } from '../../../../../utils/graphql/bob/generated';
import { dateFormat } from '../../../../../utils/helpers';
import { getTransactionType } from './AmbientMarketMakingHistoryFrame.utils';
import { BalanceChange } from './components/BalanceChange';

export const COLUMNS_CONFIG = [
  {
    id: 'time',
    title: t(translations.common.tables.columnTitles.timestamp),
    cellRenderer: (item: LiquidityChange) => (
      <>{dateFormat(Number(item.time))}</>
    ),
    sortable: true,
  },
  {
    id: 'changeType',
    title: t(translations.common.tables.columnTitles.transactionType),
    cellRenderer: (item: LiquidityChange) => <>{getTransactionType(item)}</>,
    sortable: true,
  },
  {
    id: 'balanceChange',
    title: t(
      translations.earnHistory.marketMakingHistory.columns.balanceChange,
    ),
    cellRenderer: (item: LiquidityChange) => (
      <BalanceChange liquidityChange={item} />
    ),
  },
  {
    id: 'transactionId',
    title: t(translations.common.tables.columnTitles.transactionID),
    cellRenderer: (item: LiquidityChange) => (
      <TransactionIdRenderer
        hash={item.transactionHash}
        chainId={getCurrentChain()}
      />
    ),
  },
];
