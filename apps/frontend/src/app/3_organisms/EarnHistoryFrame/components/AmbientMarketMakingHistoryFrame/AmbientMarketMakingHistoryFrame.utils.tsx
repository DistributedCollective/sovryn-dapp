import React from 'react';

import { t } from 'i18next';

import { Paragraph, ParagraphSize } from '@sovryn/ui';

import { translations } from '../../../../../locales/i18n';
import { LiquidityChange } from '../../../../../utils/graphql/bob/generated';
import { dateFormat } from '../../../../../utils/helpers';

export const getTransactionType = (item: LiquidityChange) =>
  t(
    translations.earnHistory.marketMakingHistory.types[
      item.changeType === 'mint' ? 'deposit' : 'withdrawal'
    ],
  );

export const generateRowTitle = (item: LiquidityChange) => (
  <Paragraph size={ParagraphSize.small} className="text-left">
    {getTransactionType(item)}
    {' - '}
    {dateFormat(Number(item.time))}
  </Paragraph>
);
