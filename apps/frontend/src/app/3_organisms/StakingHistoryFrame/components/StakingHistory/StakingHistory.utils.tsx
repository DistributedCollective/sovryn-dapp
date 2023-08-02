import React from 'react';

import { t } from 'i18next';

import { Paragraph, ParagraphSize } from '@sovryn/ui';

import { translations } from '../../../../../locales/i18n';
import { dateFormat } from '../../../../../utils/helpers';
import { StakingHistoryItem } from './StakingHistory.types';

export const generateRowTitle = (item: StakingHistoryItem) => (
  <Paragraph size={ParagraphSize.small} className="text-left">
    {t(translations.stakingHistory.increase)}
    {' - '}
    {dateFormat(item.timestamp)}
  </Paragraph>
);
