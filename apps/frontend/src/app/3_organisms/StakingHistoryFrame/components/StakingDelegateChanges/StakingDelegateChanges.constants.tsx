import React from 'react';

import { t } from 'i18next';

import { TransactionIdRenderer } from '../../../../2_molecules/TransactionIdRenderer/TransactionIdRenderer';
import { TxIdWithNotification } from '../../../../2_molecules/TxIdWithNotification/TransactionIdWithNotification';
import { getCurrentChain } from '../../../../../hooks/useChainStore';
import { translations } from '../../../../../locales/i18n';
import { dateFormat, getRskExplorerUrl } from '../../../../../utils/helpers';
import { StakingDelegateChangeItem } from './StakingDelegateChanges.types';

const rskExplorerUrl = getRskExplorerUrl();

export const COLUMNS_CONFIG = [
  {
    id: 'timestamp',
    title: t(translations.common.tables.columnTitles.timestamp),
    cellRenderer: (tx: StakingDelegateChangeItem) => dateFormat(tx.timestamp),
    sortable: true,
  },
  {
    id: 'transactionType',
    title: t(translations.common.tables.columnTitles.transactionType),
    cellRenderer: () => t(translations.stakingHistory.delegate),
  },
  {
    id: 'previousDelegate',
    title: t(translations.stakingHistory.previousDelegate),
    cellRenderer: (tx: StakingDelegateChangeItem) => (
      <TxIdWithNotification
        href={`${rskExplorerUrl}/address/${tx.previousDelegate?.id}`}
        value={tx.previousDelegate?.id}
      />
    ),
  },

  {
    id: 'delegate',
    title: t(translations.stakingHistory.newDelegate),
    cellRenderer: (tx: StakingDelegateChangeItem) => (
      <TxIdWithNotification
        href={`${rskExplorerUrl}/address/${tx.delegate?.id}`}
        value={tx.delegate?.id}
      />
    ),
  },

  {
    id: 'txId',
    title: t(translations.common.tables.columnTitles.transactionID),
    cellRenderer: (item: StakingDelegateChangeItem) => (
      <TransactionIdRenderer
        hash={item.id.split('-')[0]}
        dataAttribute="staking-delegate-history-tx-hash"
        chainId={getCurrentChain()}
      />
    ),
  },
];
