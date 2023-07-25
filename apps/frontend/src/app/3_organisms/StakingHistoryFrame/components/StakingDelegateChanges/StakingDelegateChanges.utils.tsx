import React from 'react';

import { t } from 'i18next';

import { Paragraph, ParagraphSize } from '@sovryn/ui';

import { translations } from '../../../../../locales/i18n';
import { dateFormat } from '../../../../../utils/helpers';
import { V2StakingDelegateChangeItem } from './StakingDelegateChanges.types';

export const generateRowTitle = (item: V2StakingDelegateChangeItem) => (
  <Paragraph size={ParagraphSize.small} className="text-left">
    {t(translations.stakingHistory.delegate)}
    {' - '}
    {dateFormat(item.timestamp)}
  </Paragraph>
);
