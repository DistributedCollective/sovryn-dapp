import React from 'react';

import { t } from 'i18next';

import { Paragraph, ParagraphSize } from '@sovryn/ui';

import { translations } from '../../../../../locales/i18n';
import { dateFormat } from '../../../../../utils/helpers';
import { StakingExtendedDurationItem } from './StakingExtendedDuration.types';

export const generateRowTitle = (item: StakingExtendedDurationItem) => (
  <Paragraph size={ParagraphSize.small} className="text-left">
    {t(translations.stakingHistory.extend)}
    {' - '}
    {dateFormat(item.timestamp)}
  </Paragraph>
);
