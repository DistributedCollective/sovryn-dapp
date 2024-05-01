import React from 'react';

import { t } from 'i18next';

import { TransactionIdRenderer } from '../../../../2_molecules/TransactionIdRenderer/TransactionIdRenderer';
import { TxIdWithNotification } from '../../../../2_molecules/TxIdWithNotification/TransactionIdWithNotification';
import { getCurrentChain } from '../../../../../hooks/useChainStore';
import { translations } from '../../../../../locales/i18n';
import { dateFormat, getRskExplorerUrl } from '../../../../../utils/helpers';
import { VestingDelegateChangeItem } from './VestingDelegateChanges.types';

const rskExplorerUrl = getRskExplorerUrl();

export const COLUMNS_CONFIG = [
  {
    id: 'timestamp',
    title: t(translations.common.tables.columnTitles.timestamp),
    cellRenderer: (tx: VestingDelegateChangeItem) => dateFormat(tx.timestamp),
    sortable: true,
  },
  {
    id: 'transactionType',
    title: t(translations.common.tables.columnTitles.transactionType),
    cellRenderer: () => t(translations.stakingHistory.delegate),
  },
  {
    id: 'delegate',
    title: t(translations.stakingHistory.newDelegate),
    cellRenderer: (tx: VestingDelegateChangeItem) => (
      <TxIdWithNotification
        href={`${rskExplorerUrl}/address/${tx.delegatee?.id}`}
        value={tx.delegatee?.id}
      />
    ),
  },
  {
    id: 'txId',
    title: t(translations.common.tables.columnTitles.transactionID),
    cellRenderer: (item: VestingDelegateChangeItem) => (
      <TransactionIdRenderer
        hash={item.transaction.id}
        dataAttribute="staking-delegate-history-tx-hash"
        chainId={getCurrentChain()}
      />
    ),
  },
];
