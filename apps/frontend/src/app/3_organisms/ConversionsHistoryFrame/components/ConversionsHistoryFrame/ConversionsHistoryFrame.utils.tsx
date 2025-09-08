import React from 'react';

import { t } from 'i18next';

import { Paragraph, ParagraphSize } from '@sovryn/ui';

import { translations } from '../../../../../locales/i18n';
import { dateFormat } from '../../../../../utils/helpers';
import { Swap } from './ConversionsHistoryFrame.constants';

export const generateRowTitle = (item: Swap) => (
  <Paragraph size={ParagraphSize.small} className="text-left">
    {`${t(translations.conversionsHistory.swap)} - ${dateFormat(
      new Date(item.confirmedAt).getTime() / 1000,
    )}`}
  </Paragraph>
);
