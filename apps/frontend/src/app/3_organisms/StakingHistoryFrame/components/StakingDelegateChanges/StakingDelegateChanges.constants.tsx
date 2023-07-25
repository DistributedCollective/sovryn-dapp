import React from 'react';

import { t } from 'i18next';

import { TransactionIdRenderer } from '../../../../2_molecules/TransactionIdRenderer/TransactionIdRenderer';
import { TxIdWithNotification } from '../../../../2_molecules/TxIdWithNotification/TransactionIdWithNotification';
import { translations } from '../../../../../locales/i18n';
import { dateFormat } from '../../../../../utils/helpers';
import { V2StakingDelegateChangeItem } from './StakingDelegateChanges.types';

export const COLUMNS_CONFIG = [
  {
    id: 'timestamp',
    title: t(translations.common.tables.columnTitles.timestamp),
    cellRenderer: (tx: V2StakingDelegateChangeItem) => dateFormat(tx.timestamp),
    sortable: true,
  },
  {
    id: 'transactionType',
    title: t(translations.common.tables.columnTitles.transactionType),
    cellRenderer: () => t(translations.stakingHistory.delegate),
  },
  {
    id: 'delegate',
    title: t(translations.stakingHistory.delegate),
    cellRenderer: (tx: V2StakingDelegateChangeItem) => (
      <TxIdWithNotification href="" value={tx.delegate?.id} />
    ),
  },
  {
    id: 'previousDelegate',
    title: t(translations.stakingHistory.previousDelegate),
    cellRenderer: (tx: V2StakingDelegateChangeItem) => (
      <TxIdWithNotification href="" value={tx.previousDelegate?.id} />
    ),
  },

  {
    id: 'txId',
    title: t(translations.common.tables.columnTitles.transactionID),
    cellRenderer: (item: V2StakingDelegateChangeItem) => (
      <TransactionIdRenderer
        hash={item.id.split('-')[0]}
        dataAttribute="staking-delegate-history-tx-hash"
      />
    ),
  },
];
