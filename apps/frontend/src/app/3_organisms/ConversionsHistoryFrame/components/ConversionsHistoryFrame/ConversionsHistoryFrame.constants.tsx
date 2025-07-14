import React from 'react';

import { t } from 'i18next';

import { ChainId } from '@sovryn/ethers-provider';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { TransactionIdRenderer } from '../../../../2_molecules/TransactionIdRenderer/TransactionIdRenderer';
import {
  BTC_RENDER_PRECISION,
  TOKEN_RENDER_PRECISION,
} from '../../../../../constants/currencies';
import { getTokenDisplayName } from '../../../../../constants/tokens';
import { translations } from '../../../../../locales/i18n';
import { COMMON_SYMBOLS } from '../../../../../utils/asset';
import { dateFormat } from '../../../../../utils/helpers';
import { decimalic } from '../../../../../utils/math';

export type Token = {
  address: string;
  decimals: number;
  symbol: string;
  logoUrl: string;
};

export type Swap = {
  id: number;
  transactionHash: string;
  user: string;
  base: Token;
  baseAmount: string;
  quote: Token;
  quoteAmount: string;
  fees: string;
  price: string;
  confirmedAt: string;
  block: number;
  callIndex: number;
};

export const COLUMNS_CONFIG = (chain: ChainId) => [
  {
    id: 'timestamp',
    title: t(translations.common.tables.columnTitles.timestamp),
    cellRenderer: (item: Swap) => (
      <>{dateFormat(new Date(item.confirmedAt).getTime() / 1000)}</>
    ),
    sortable: true,
  },
  {
    id: 'transactionType',
    title: t(translations.common.tables.columnTitles.transactionType),
    cellRenderer: () => <>{t(translations.conversionsHistory.swap)}</>,
  },
  {
    id: 'sent',
    title: t(translations.conversionsHistory.table.sent),
    cellRenderer: (item: Swap) => (
      <AmountRenderer
        value={item.baseAmount}
        suffix={getTokenDisplayName(item.base.symbol!)}
      />
    ),
  },
  {
    id: 'received',
    title: t(translations.conversionsHistory.table.received),
    cellRenderer: (item: Swap) => (
      <AmountRenderer
        value={item.quoteAmount}
        suffix={getTokenDisplayName(item.quote.symbol!)}
      />
    ),
  },
  {
    id: 'conversionFee',
    title: t(translations.conversionsHistory.table.conversionFee),
    cellRenderer: (swap: Swap) => (
      <AmountRenderer
        value={decimalic(swap.fees)}
        suffix={getTokenDisplayName(swap.quote.symbol!)}
        precision={
          [COMMON_SYMBOLS.BTC, COMMON_SYMBOLS.WBTC].includes(swap.base.symbol)
            ? BTC_RENDER_PRECISION
            : TOKEN_RENDER_PRECISION
        }
        dataAttribute="amm-history-fee"
      />
    ),
  },
  {
    id: 'transactionId',
    title: t(translations.common.tables.columnTitles.transactionID),
    cellRenderer: (item: Swap) => (
      <TransactionIdRenderer
        hash={item.transactionHash}
        chainId={chain}
        dataAttribute="amm-conversion-history-tx-hash"
      />
    ),
  },
];
