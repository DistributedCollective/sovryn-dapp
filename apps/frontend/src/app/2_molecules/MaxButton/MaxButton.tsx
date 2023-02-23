import React, { FC } from 'react';

import { t } from 'i18next';

import { applyDataAttr } from '@sovryn/ui';

import { translations } from '../../../locales/i18n';
import { AmountRenderer } from '../AmountRenderer/AmountRenderer';

type MaxButtonProps = {
  value: string | number;
  onClick?: () => void;
  precision?: number;
  token: string;
  dataAttribute?: string;
};

export const MaxButton: FC<MaxButtonProps> = ({
  value,
  onClick,
  precision = 4,
  token,
  dataAttribute,
}) => (
  <button
    onClick={onClick}
    className="text-xs font-medium underline whitespace-nowrap"
    {...applyDataAttr(dataAttribute)}
  >
    ({t(translations.common.max)}
    <AmountRenderer
      value={value}
      precision={precision}
      suffix={token.toUpperCase()}
    />
    )
  </button>
);
