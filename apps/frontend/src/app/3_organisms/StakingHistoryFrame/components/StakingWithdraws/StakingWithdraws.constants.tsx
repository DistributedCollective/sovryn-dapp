import React from 'react';

import { t } from 'i18next';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { TransactionIdRenderer } from '../../../../2_molecules/TransactionIdRenderer/TransactionIdRenderer';
import { getTokenDisplayName } from '../../../../../constants/tokens';
import { getCurrentChain } from '../../../../../hooks/useChainStore';
import { translations } from '../../../../../locales/i18n';
import { COMMON_SYMBOLS } from '../../../../../utils/asset';
import { dateFormat } from '../../../../../utils/helpers';
import { StakingWithdrawItem } from './StakingWithdraws.types';

export const COLUMNS_CONFIG = [
  {
    id: 'timestamp',
    title: t(translations.common.tables.columnTitles.timestamp),
    cellRenderer: (tx: StakingWithdrawItem) => dateFormat(tx.timestamp),
    sortable: true,
  },
  {
    id: 'transactionType',
    title: t(translations.common.tables.columnTitles.transactionType),
    cellRenderer: () => t(translations.stakingHistory.unstake),
  },
  {
    id: 'amount',
    title: t(translations.stakingHistory.stakeChange),
    cellRenderer: (tx: StakingWithdrawItem) => (
      <AmountRenderer
        prefix="-"
        value={tx.amount || 0}
        suffix={getTokenDisplayName(COMMON_SYMBOLS.SOV)}
      />
    ),
    sortable: true,
  },
  {
    id: 'slashedAmount',
    title: t(translations.stakingHistory.unstakingPenalty),
    cellRenderer: (tx: StakingWithdrawItem) => (
      <AmountRenderer
        prefix="-"
        value={tx.slashedAmount || 0}
        suffix={getTokenDisplayName(COMMON_SYMBOLS.SOV)}
      />
    ),
  },
  {
    id: 'until',
    title: t(translations.stakingHistory.lockedUntil),
    cellRenderer: (tx: StakingWithdrawItem) => dateFormat(tx.until),
    sortable: true,
  },
  {
    id: 'txId',
    title: t(translations.common.tables.columnTitles.transactionID),
    cellRenderer: (item: StakingWithdrawItem) => (
      <TransactionIdRenderer
        hash={item.id.split('-')[0]}
        dataAttribute="staking-withdraw-tx-hash"
        chainId={getCurrentChain()}
      />
    ),
  },
];
