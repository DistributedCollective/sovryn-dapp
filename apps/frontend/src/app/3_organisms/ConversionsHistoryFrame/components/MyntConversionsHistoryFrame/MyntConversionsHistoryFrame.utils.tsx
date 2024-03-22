import React from 'react';

import { t } from 'i18next';

import { Paragraph, ParagraphSize } from '@sovryn/ui';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { MASSET } from '../../../../5_pages/ConvertPage/ConvertPage.constants';
import { TOKEN_RENDER_PRECISION } from '../../../../../constants/currencies';
import { translations } from '../../../../../locales/i18n';
import {
  Conversion,
  ConversionType,
} from '../../../../../utils/graphql/mynt/generated';
import { dateFormat } from '../../../../../utils/helpers';

export const generateRowTitle = (item: Conversion) => (
  <Paragraph size={ParagraphSize.small} className="text-left">
    {`${
      item.type === ConversionType.Incoming
        ? t(translations.conversionsHistory.mint)
        : t(translations.conversionsHistory.burn)
    } - ${dateFormat(item.transaction.timestamp)}`}
  </Paragraph>
);

export const sentAmountRenderer = (item: Conversion) => {
  const isIncomingTransaction = item.type === ConversionType.Incoming; // bAsset -> mAsset

  const amount = isIncomingTransaction
    ? item.bassetQuantity
    : item.massetQuantity;
  const asset = isIncomingTransaction
    ? item.bAsset.symbol
    : MASSET.toUpperCase();

  return <AmountRenderer value={amount} suffix={asset!} />;
};

export const receivedAmountRenderer = (item: Conversion) => {
  const isIncomingTransaction = item.type === ConversionType.Incoming; // bAsset -> mAsset

  const amount = isIncomingTransaction
    ? item.massetQuantity
    : item.bassetQuantity;
  const asset = isIncomingTransaction
    ? MASSET.toUpperCase()
    : item.bAsset.symbol;

  return (
    <AmountRenderer
      value={amount}
      suffix={asset!}
      precision={TOKEN_RENDER_PRECISION}
    />
  );
};
