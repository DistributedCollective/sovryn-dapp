import React from 'react';

import { t } from 'i18next';

import { SupportedTokens } from '@sovryn/contracts';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { TransactionIdRenderer } from '../../../../2_molecules/TransactionIdRenderer/TransactionIdRenderer';
import { getTokenDisplayName } from '../../../../../constants/tokens';
import { translations } from '../../../../../locales/i18n';
import { dateFormat } from '../../../../../utils/helpers';
import { V2StakingHistoryItem } from './StakingHistory.types';

export const COLUMNS_CONFIG = [
  {
    id: 'timestamp',
    title: t(translations.common.tables.columnTitles.timestamp),
    cellRenderer: (tx: V2StakingHistoryItem) => dateFormat(tx.timestamp),
    sortable: true,
  },
  {
    id: 'transactionType',
    title: t(translations.common.tables.columnTitles.transactionType),
    cellRenderer: () => t(translations.stakingHistory.increase),
  },
  {
    id: 'lockedUntil',
    title: t(translations.stakingHistory.lockedUntil),
    cellRenderer: (tx: V2StakingHistoryItem) => dateFormat(tx.lockedUntil),
    sortable: true,
  },
  {
    id: 'amount',
    title: t(translations.stakingHistory.stakeChange),
    cellRenderer: (tx: V2StakingHistoryItem) => (
      <AmountRenderer
        value={tx.amount || 0}
        prefix="+"
        suffix={getTokenDisplayName(SupportedTokens.sov)}
      />
    ),
    sortable: true,
  },
  {
    id: 'txId',
    title: t(translations.common.tables.columnTitles.transactionID),
    cellRenderer: (item: V2StakingHistoryItem) => (
      <TransactionIdRenderer
        hash={item.id.split('-')[0]}
        dataAttribute="staking-history-tx-hash"
      />
    ),
  },
];
