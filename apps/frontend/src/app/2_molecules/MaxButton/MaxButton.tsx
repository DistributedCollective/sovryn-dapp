import React, { FC } from 'react';

import { t } from 'i18next';

import { SupportedTokens } from '@sovryn/contracts';
import { applyDataAttr } from '@sovryn/ui';
import { Decimalish } from '@sovryn/utils';

import { getTokenDisplayName } from '../../../constants/tokens';
import { translations } from '../../../locales/i18n';
import { AmountRenderer } from '../AmountRenderer/AmountRenderer';

type MaxButtonProps = {
  value: Decimalish;
  onClick?: () => void;
  precision?: number;
  token: SupportedTokens;
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
    {`(${t(translations.common.max)} `}
    <AmountRenderer
      value={value}
      precision={precision}
      suffix={getTokenDisplayName(token)}
      useTooltip={false}
    />
    {`)`}
  </button>
);
