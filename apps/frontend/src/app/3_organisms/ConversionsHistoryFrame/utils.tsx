import React from 'react';

import { t } from 'i18next';

import { Paragraph, ParagraphSize } from '@sovryn/ui';

import { translations } from '../../../locales/i18n';
import { Conversion } from '../../../utils/graphql/mynt/generated';
import { dateFormat } from '../../../utils/helpers';

export const generateRowTitle = (item: Conversion) => (
  <Paragraph size={ParagraphSize.small}>
    {`${t(translations.conversionsHistory.type)} - ${dateFormat(
      item.transaction.timestamp,
    )}`}
  </Paragraph>
);
