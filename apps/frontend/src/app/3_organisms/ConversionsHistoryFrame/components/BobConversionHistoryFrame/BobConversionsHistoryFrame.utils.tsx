import React from 'react';

import { t } from 'i18next';

import { Paragraph, ParagraphSize } from '@sovryn/ui';

import { translations } from '../../../../../locales/i18n';
import { Swap } from '../../../../../utils/graphql/bob/generated';
import { dateFormat } from '../../../../../utils/helpers';

export const generateRowTitle = (item: Swap) => (
  <Paragraph size={ParagraphSize.small} className="text-left">
    {`${t(translations.conversionsHistory.swap)} - ${dateFormat(
      Number(item.time),
    )}`}
  </Paragraph>
);

export const generateTransactionType = (item: Swap) => {
  const title =
    item.qty === '0'
      ? t(translations.conversionsHistory.swapMultihop)
      : t(translations.conversionsHistory.swap);
  return <Paragraph size={ParagraphSize.small}>{title}</Paragraph>;
};
