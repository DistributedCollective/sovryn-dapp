import React from 'react';

import { t } from 'i18next';

import { Paragraph, ParagraphSize } from '@sovryn/ui';

import { translations } from '../../../../../locales/i18n';
import { Swap } from '../../../../../utils/graphql/rsk/generated';
import { dateFormat } from '../../../../../utils/helpers';

export const generateRowTitle = (item: Swap) => (
  <Paragraph size={ParagraphSize.small} className="text-left">
    {`${t(translations.conversionsHistory.swap)} - ${dateFormat(
      item.transaction.timestamp,
    )}`}
  </Paragraph>
);
