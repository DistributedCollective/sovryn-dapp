import React from 'react';

import { t } from 'i18next';

import { SupportedTokens } from '@sovryn/contracts';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { TransactionIdRenderer } from '../../../../2_molecules/TransactionIdRenderer/TransactionIdRenderer';
import { getTokenDisplayName } from '../../../../../constants/tokens';
import { translations } from '../../../../../locales/i18n';
import { dateFormat } from '../../../../../utils/helpers';
import { V2StakingExtendedDurationItem } from './StakingExtendedDuration.types';

export const COLUMNS_CONFIG = [
  {
    id: 'timestamp',
    title: t(translations.common.tables.columnTitles.timestamp),
    cellRenderer: (tx: V2StakingExtendedDurationItem) =>
      dateFormat(tx.timestamp),
    sortable: true,
  },
  {
    id: 'transactionType',
    title: t(translations.common.tables.columnTitles.transactionType),
    cellRenderer: () => t(translations.stakingHistory.extend),
  },
  {
    id: 'newDate',
    title: t(translations.stakingHistory.newDate),
    cellRenderer: (tx: V2StakingExtendedDurationItem) => dateFormat(tx.newDate),
    sortable: true,
  },
  {
    id: 'previousDate',
    title: t(translations.stakingHistory.previousDate),
    cellRenderer: (tx: V2StakingExtendedDurationItem) =>
      dateFormat(tx.previousDate),
    sortable: true,
  },
  {
    id: 'amountStaked',
    title: t(translations.stakingHistory.amount),
    cellRenderer: (tx: V2StakingExtendedDurationItem) => (
      <AmountRenderer
        value={tx.amountStaked || 0}
        suffix={getTokenDisplayName(SupportedTokens.sov)}
      />
    ),
    sortable: true,
  },
  {
    id: 'txId',
    title: t(translations.common.tables.columnTitles.transactionID),
    cellRenderer: (item: V2StakingExtendedDurationItem) => (
      <TransactionIdRenderer
        hash={item.id.split('-')[0]}
        dataAttribute="staking-extend-history-tx-hash"
      />
    ),
  },
];
