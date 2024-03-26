import React, { FC } from 'react';

import { t } from 'i18next';

import { applyDataAttr } from '@sovryn/ui';
import { Decimalish } from '@sovryn/utils';

import { TokenBalance } from '../../3_organisms/RuneBridgeDialog/contexts/contract';
import { getTokenDisplayName } from '../../../constants/tokens';
import { translations } from '../../../locales/i18n';
import { AmountRenderer } from '../AmountRenderer/AmountRenderer';

type MaxButtonProps = {
  value: Decimalish;
  onClick?: () => void;
  precision?: number;
  token: TokenBalance;
  dataAttribute?: string;
  label?: string;
};

export const RuneBridgeMaxButton: FC<MaxButtonProps> = ({
  value,
  onClick,
  precision = 4,
  token,
  dataAttribute,
  label = t(translations.common.max),
}) => (
  <button
    onClick={onClick}
    className="text-xs font-medium underline whitespace-nowrap"
    {...applyDataAttr(dataAttribute)}
  >
    {`(${label} `}
    <AmountRenderer
      value={value}
      precision={precision}
      suffix={getTokenDisplayName(token.symbol)}
      useTooltip={false}
    />
    {`)`}
  </button>
);
