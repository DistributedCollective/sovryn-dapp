import React from 'react';

import { t } from 'i18next';

import { Paragraph, ParagraphSize } from '@sovryn/ui';

import { translations } from '../../../../../locales/i18n';
import { dateFormat } from '../../../../../utils/helpers';
import { LendingHistoryItem } from './AaveLendingHistoryFrame.types';

export const generateRowTitle = (
  item: LendingHistoryItem,
  isOpen?: boolean,
) => (
  <Paragraph size={ParagraphSize.small} className="text-left">
    {getTransactionType(item)}
    {' - '}
    {dateFormat(Number(item.timestamp))}
  </Paragraph>
);

export const getTransactionType = (item: LendingHistoryItem) => {
  if (item.action === 'Supply') {
    return t(translations.earnHistory.types.supply);
  } else if (item.action === 'RedeemUnderlying') {
    return t(translations.earnHistory.types.withdrawal);
  } else if (item.action === 'UsageAsCollateral') {
    return item.toState
      ? t(translations.earnHistory.types.useAsCollateral)
      : t(translations.earnHistory.types.removeAsCollateral);
  } else return '-';
};
