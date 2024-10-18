import React from 'react';

import { formatUnits } from 'ethers/lib/utils';
import { t } from 'i18next';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { TransactionIdRenderer } from '../../../../2_molecules/TransactionIdRenderer/TransactionIdRenderer';
import { getCurrentChain } from '../../../../../hooks/useChainStore';
import { translations } from '../../../../../locales/i18n';
import { dateFormat } from '../../../../../utils/helpers';
import { LendingHistoryItem } from './AaveLendingHistoryFrame.types';
import { getTransactionType } from './AaveLendingHistoryFrame.utils';

export const COLUMNS_CONFIG = [
  {
    id: 'timestamp',
    title: t(translations.common.tables.columnTitles.timestamp),
    cellRenderer: (item: LendingHistoryItem) => (
      <>{dateFormat(Number(item.timestamp))}</>
    ),
    sortable: true,
  },
  {
    id: 'action',
    title: t(translations.common.tables.columnTitles.transactionType),
    cellRenderer: (item: LendingHistoryItem) => getTransactionType(item),
  },
  {
    id: 'amount',
    title: t(translations.common.tables.columnTitles.amount),
    cellRenderer: (item: LendingHistoryItem) => (
      <div>
        {item.amount ? (
          <AmountRenderer
            value={formatUnits(item.amount, item.reserve.decimals)}
            precision={2}
            showRoundingPrefix
          />
        ) : (
          <span>{t(translations.common.na)} </span>
        )}
        {item.reserve.symbol}
      </div>
    ),
  },
  {
    id: 'transactionId',
    title: t(translations.common.tables.columnTitles.transactionID),
    cellRenderer: (item: LendingHistoryItem) => (
      <TransactionIdRenderer hash={item.txHash} chainId={getCurrentChain()} />
    ),
  },
];
