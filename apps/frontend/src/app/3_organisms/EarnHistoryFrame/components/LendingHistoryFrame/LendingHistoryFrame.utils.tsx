import React from 'react';

import { t } from 'i18next';

import { Paragraph, ParagraphSize } from '@sovryn/ui';

import { translations } from '../../../../../locales/i18n';
import { LendingHistoryType } from '../../../../../utils/graphql/rsk/generated';
import { dateFormat } from '../../../../../utils/helpers';
import { LendingEvent } from './LendingHistoryFrame.types';

export const getTransactionType = (type: LendingHistoryType) =>
  t(
    translations.common.transactionTypes[
      type === LendingHistoryType.Lend ? 'deposit' : 'withdrawal'
    ],
  );

export const generateRowTitle = (item: LendingEvent) => (
  <Paragraph size={ParagraphSize.small} className="text-left">
    {getTransactionType(item.type)}
    {' - '}
    {dateFormat(item.timestamp)}
  </Paragraph>
);
