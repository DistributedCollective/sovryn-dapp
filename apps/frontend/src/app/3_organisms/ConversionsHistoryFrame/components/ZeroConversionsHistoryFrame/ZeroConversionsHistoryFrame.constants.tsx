import React from 'react';

import { t } from 'i18next';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { TransactionIdRenderer } from '../../../../2_molecules/TransactionIdRenderer/TransactionIdRenderer';
import {
  BITCOIN,
  BTC_RENDER_PRECISION,
  TOKEN_RENDER_PRECISION,
} from '../../../../../constants/currencies';
import { translations } from '../../../../../locales/i18n';
import { COMMON_SYMBOLS } from '../../../../../utils/asset';
import { Redemption } from '../../../../../utils/graphql/zero/generated';
import { dateFormat } from '../../../../../utils/helpers';
import { renderRedemptionFee } from './ZeroConversionsHistoryFrame.utils';

export const COLUMNS_CONFIG = [
  {
    id: 'sequenceNumber',
    title: t(translations.common.tables.columnTitles.timestamp),
    cellRenderer: (item: Redemption) => (
      <>{dateFormat(item.transaction.timestamp)}</>
    ),
    sortable: true,
  },
  {
    id: 'transactionType',
    title: t(translations.common.tables.columnTitles.transactionType),
    cellRenderer: () => <>{t(translations.conversionsHistory.redeem)}</>,
  },
  {
    id: 'sent',
    title: t(translations.conversionsHistory.table.sent),
    cellRenderer: (redemption: Redemption) =>
      redemption.tokensActuallyRedeemed.length ? (
        <AmountRenderer
          value={redemption.tokensActuallyRedeemed}
          suffix={COMMON_SYMBOLS.ZUSD}
          precision={TOKEN_RENDER_PRECISION}
          dataAttribute="redemption-history-zusd-redeemed"
        />
      ) : (
        '-'
      ),
  },
  {
    id: 'received',
    title: t(translations.conversionsHistory.table.received),
    cellRenderer: (redemption: Redemption) =>
      redemption.collateralRedeemed.length ? (
        <AmountRenderer
          value={redemption.collateralRedeemed}
          suffix={BITCOIN}
          precision={BTC_RENDER_PRECISION}
          dataAttribute="redemption-history-rbtc-received"
        />
      ) : (
        '-'
      ),
  },
  {
    id: 'redemptionFee',
    title: t(translations.redemptionsHistory.table.redemptionFee),
    cellRenderer: renderRedemptionFee,
  },
  {
    id: 'transactionId',
    title: t(translations.common.tables.columnTitles.transactionID),
    cellRenderer: (item: Redemption) => (
      <TransactionIdRenderer
        hash={item.transaction.id}
        dataAttribute="zero-conversion-history-tx-hash"
      />
    ),
  },
];
