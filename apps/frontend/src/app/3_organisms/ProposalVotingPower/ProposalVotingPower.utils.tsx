import React from 'react';

import { t } from 'i18next';

import { Paragraph, ParagraphSize } from '@sovryn/ui';

import { AmountRenderer } from '../../2_molecules/AmountRenderer/AmountRenderer';
import { TOKEN_RENDER_PRECISION } from '../../../constants/currencies';
import { translations } from '../../../locales/i18n';

export const LabeledAmount = ({
  label,
  amount,
  amountSuffix = '',
  precision = TOKEN_RENDER_PRECISION,
}) => (
  <div className="basis-full font-medium">
    <Paragraph
      size={ParagraphSize.base}
      className="text-gray-30 md:mb-3 leading-4 text-xs"
    >
      {label}
    </Paragraph>
    {amount ? (
      <AmountRenderer
        value={amount}
        suffix={amountSuffix}
        precision={precision}
      />
    ) : (
      t(translations.common.na)
    )}
  </div>
);
