import React from 'react';

import { t } from 'i18next';

import { Paragraph, ParagraphSize } from '@sovryn/ui';

import { translations } from '../../../../../locales/i18n';
import { dateFormat } from '../../../../../utils/helpers';
import { StakingWithdrawItem } from './StakingWithdraws.types';

export const generateRowTitle = (item: StakingWithdrawItem) => (
  <Paragraph size={ParagraphSize.small} className="text-left">
    {t(translations.stakingHistory.unstake)}
    {' - '}
    {dateFormat(item.timestamp)}
  </Paragraph>
);
