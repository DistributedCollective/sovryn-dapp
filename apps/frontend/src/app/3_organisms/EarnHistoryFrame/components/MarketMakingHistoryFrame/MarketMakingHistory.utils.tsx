import React from 'react';

import { t } from 'i18next';

import { Paragraph, ParagraphSize } from '@sovryn/ui';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { getTokenDisplayName } from '../../../../../constants/tokens';
import { translations } from '../../../../../locales/i18n';
import {
  LiquidityHistoryItem,
  LiquidityHistoryType,
} from '../../../../../utils/graphql/rsk/generated';
import { dateFormat } from '../../../../../utils/helpers';
import { decimalic } from '../../../../../utils/math';

export const getTransactionType = (item: LiquidityHistoryItem) =>
  t(
    translations.earnHistory.marketMakingHistory.types[
      item.type === LiquidityHistoryType.Added ? 'deposit' : 'withdrawal'
    ],
  );

export const renderBalanceChange = (item: LiquidityHistoryItem) => (
  <AmountRenderer
    value={
      item.type === LiquidityHistoryType.Added
        ? decimalic(item.amount)
        : decimalic(item.amount).mul(-1)
    }
    suffix={getTokenDisplayName(item.reserveToken.symbol || '')}
    prefix={item.type === LiquidityHistoryType.Added ? '+' : ''}
  />
);

export const generateRowTitle = (item: LiquidityHistoryItem) => (
  <Paragraph size={ParagraphSize.small} className="text-left">
    {getTransactionType(item)}
    {' - '}
    {dateFormat(item.timestamp)}
  </Paragraph>
);
