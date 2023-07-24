import React from 'react';

import { t } from 'i18next';

import { SupportedTokens } from '@sovryn/contracts';
import { Paragraph, ParagraphSize } from '@sovryn/ui';

import { AmountRenderer } from '../../../2_molecules/AmountRenderer/AmountRenderer';
import { TransactionIdRenderer } from '../../../2_molecules/TransactionIdRenderer/TransactionIdRenderer';
import { getTokenDisplayName } from '../../../../constants/tokens';
import { translations } from '../../../../locales/i18n';
import { dateFormat } from '../../../../utils/helpers';
import { V2StakingHistoryItem } from './StakingHistory.types';

export const generateRowTitle = (item: V2StakingHistoryItem) => (
  <Paragraph size={ParagraphSize.small} className="text-left">
    {dateFormat(item.timestamp)}
  </Paragraph>
);

export const columnsConfig = [
  {
    id: 'timestamp',
    title: t(translations.common.tables.columnTitles.timestamp),
    cellRenderer: (tx: V2StakingHistoryItem) => dateFormat(tx.timestamp),
    sortable: true,
  },
  {
    id: 'lockedUntil',
    title: t(translations.stakingHistory.lockedUntil),
    cellRenderer: (tx: V2StakingHistoryItem) => dateFormat(tx.lockedUntil),
    sortable: true,
  },
  {
    id: 'amount',
    title: t(translations.stakingHistory.amount),
    cellRenderer: (tx: V2StakingHistoryItem) => (
      <AmountRenderer
        value={tx.amount || 0}
        suffix={getTokenDisplayName(SupportedTokens.sov)}
      />
    ),
    sortable: true,
  },
  {
    id: 'txId',
    title: t(translations.common.tables.columnTitles.transactionID),
    cellRenderer: (item: V2StakingHistoryItem) => (
      <TransactionIdRenderer hash={item.id.split('-')[0]} />
    ),
  },
];
