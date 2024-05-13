import React from 'react';

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

export const getConversionAmount = (swap: Swap, base: boolean) => {
  const isBaseFlowNegative = swap.baseFlow.startsWith('-');

  const token = findAssetByAddress(
    base
      ? isBaseFlowNegative
        ? swap.pool.quote
        : swap.pool.base
      : isBaseFlowNegative
      ? swap.pool.base
      : swap.pool.quote,
    getCurrentChain(),
  );
  return {
    token,
    amount: decimalic(
      base
        ? isBaseFlowNegative
          ? swap.quoteFlow
          : swap.baseFlow
        : isBaseFlowNegative
        ? swap.baseFlow
        : swap.quoteFlow,
    )
      .abs()
      .toUnits(token?.decimals ?? 18),
  };
};

const renderAmount = (swap: Swap, base: boolean) => {
  const { token, amount } = getConversionAmount(swap, base);
  return (
    <AmountRenderer
      value={amount}
      suffix={
        token?.symbol ?? prettyTx(base ? swap.pool.base : swap.pool.quote)
      }
      asIf
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
    cellRenderer: (item: Swap) => renderAmount(item, true),
  },
  {
    id: 'received',
    title: t(translations.conversionsHistory.table.received),
    cellRenderer: (item: Swap) => renderAmount(item, false),
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
