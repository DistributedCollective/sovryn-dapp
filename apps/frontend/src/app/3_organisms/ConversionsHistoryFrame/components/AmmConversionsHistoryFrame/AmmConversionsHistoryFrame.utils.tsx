import React from 'react';

import { t } from 'i18next';

import { Paragraph, ParagraphSize } from '@sovryn/ui';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import {
  BITCOIN,
  BTC_RENDER_PRECISION,
} from '../../../../../constants/currencies';
import { translations } from '../../../../../locales/i18n';
import { Swap } from '../../../../../utils/graphql/rsk/generated';
import { dateFormat } from '../../../../../utils/helpers';
import { decimalic } from '../../../../../utils/math';

export const generateRowTitle = (item: Swap) => (
  <Paragraph size={ParagraphSize.small} className="text-left">
    {`${t(translations.conversionsHistory.type)} - ${dateFormat(
      item.transaction.timestamp,
    )}`}
  </Paragraph>
);

export const renderConversionFee = (swap: Swap) => (
  <AmountRenderer
    value={decimalic(swap.conversionFee).add(swap.protocolFee || '0')}
    suffix={BITCOIN}
    precision={BTC_RENDER_PRECISION}
    dataAttribute="amm-history-fee"
  />
);
