import React from 'react';

import { formatUnits } from 'ethers/lib/utils';
import { t } from 'i18next';

import { prettyTx } from '@sovryn/ui';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { TransactionIdRenderer } from '../../../../2_molecules/TransactionIdRenderer/TransactionIdRenderer';
import { getCurrentChain } from '../../../../../hooks/useChainStore';
import { translations } from '../../../../../locales/i18n';
import { findAssetByAddress } from '../../../../../utils/asset';
import { Swap } from '../../../../../utils/graphql/bob/generated';
import { dateFormat } from '../../../../../utils/helpers';
import { decimalic } from '../../../../../utils/math';
import { generateTransactionType } from './BobConversionsHistoryFrame.utils';

export const getConversionAmount = (
  value: string,
  pool: { base: string; quote: string },
  inBaseQty: boolean,
) => {
  const token = findAssetByAddress(
    inBaseQty ? pool.base : pool.quote,
    getCurrentChain(),
  );
  return {
    token,
    amount: decimalic(formatUnits(value, token?.decimals || 18)).abs(),
  };
};

const renderAmount = (
  value: string,
  pool: { base: string; quote: string },
  inBaseQty: boolean,
) => {
  const { token, amount } = getConversionAmount(value, pool, inBaseQty);
  return (
    <AmountRenderer
      value={amount}
      suffix={token?.symbol ?? prettyTx(inBaseQty ? pool.base : pool.quote)}
    />
  );
};

export const COLUMNS_CONFIG = [
  {
    id: 'time',
    title: t(translations.common.tables.columnTitles.timestamp),
    cellRenderer: (item: Swap) => <>{dateFormat(Number(item.time))}</>,
    sortable: true,
  },
  {
    id: 'transactionType',
    title: t(translations.common.tables.columnTitles.transactionType),
    cellRenderer: generateTransactionType,
  },
  {
    id: 'sent',
    title: t(translations.conversionsHistory.table.sent),
    cellRenderer: (item: Swap) =>
      renderAmount(
        item.inBaseQty ? item.baseFlow : item.quoteFlow,
        item.pool,
        item.inBaseQty,
      ),
  },
  {
    id: 'received',
    title: t(translations.conversionsHistory.table.received),
    cellRenderer: (item: Swap) =>
      renderAmount(
        item.inBaseQty ? item.quoteFlow : item.baseFlow,
        item.pool,
        !item.inBaseQty,
      ),
  },
  {
    id: 'transactionId',
    title: t(translations.common.tables.columnTitles.transactionID),
    cellRenderer: (item: Swap) => (
      <TransactionIdRenderer
        hash={item.transactionHash}
        dataAttribute="bob-conversion-history-tx-hash"
        chainId={getCurrentChain()}
      />
    ),
  },
];
