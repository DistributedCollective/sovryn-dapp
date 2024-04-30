import React from 'react';

import { t } from 'i18next';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { TransactionIdRenderer } from '../../../../2_molecules/TransactionIdRenderer/TransactionIdRenderer';
import { getTokenDisplayName } from '../../../../../constants/tokens';
import { getCurrentChain } from '../../../../../hooks/useChainStore';
import { translations } from '../../../../../locales/i18n';
import { COMMON_SYMBOLS } from '../../../../../utils/asset';
import { dateFormat } from '../../../../../utils/helpers';
import { StakingExtendedDurationItem } from './StakingExtendedDuration.types';

export const COLUMNS_CONFIG = [
  {
    id: 'timestamp',
    title: t(translations.common.tables.columnTitles.timestamp),
    cellRenderer: (tx: StakingExtendedDurationItem) => dateFormat(tx.timestamp),
    sortable: true,
  },
  {
    id: 'transactionType',
    title: t(translations.common.tables.columnTitles.transactionType),
    cellRenderer: () => t(translations.stakingHistory.extend),
  },
  {
    id: 'amountStaked',
    title: t(translations.stakingHistory.amount),
    cellRenderer: (tx: StakingExtendedDurationItem) => (
      <AmountRenderer
        value={tx.amountStaked || 0}
        suffix={getTokenDisplayName(COMMON_SYMBOLS.SOV)}
      />
    ),
    sortable: true,
  },
  {
    id: 'previousDate',
    title: t(translations.stakingHistory.previousDate),
    cellRenderer: (tx: StakingExtendedDurationItem) =>
      dateFormat(tx.previousDate),
    sortable: true,
  },
  {
    id: 'newDate',
    title: t(translations.stakingHistory.newDate),
    cellRenderer: (tx: StakingExtendedDurationItem) => dateFormat(tx.newDate),
    sortable: true,
  },

  {
    id: 'txId',
    title: t(translations.common.tables.columnTitles.transactionID),
    cellRenderer: (item: StakingExtendedDurationItem) => (
      <TransactionIdRenderer
        hash={item.id.split('-')[0]}
        dataAttribute="staking-extend-history-tx-hash"
        chainId={getCurrentChain()}
      />
    ),
  },
];
