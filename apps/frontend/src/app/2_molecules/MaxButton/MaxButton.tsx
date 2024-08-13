import React, { FC } from 'react';

import { t } from 'i18next';

import { ChainId } from '@sovryn/ethers-provider';
import { applyDataAttr } from '@sovryn/ui';
import { Decimalish } from '@sovryn/utils';

import { getTokenDisplayName } from '../../../constants/tokens';
import { translations } from '../../../locales/i18n';
import { AmountRenderer } from '../AmountRenderer/AmountRenderer';

type MaxButtonProps = {
  value: Decimalish;
  onClick?: () => void;
  precision?: number;
  token: string;
  dataAttribute?: string;
  label?: string;
  chainId?: ChainId;
};

export const MaxButton: FC<MaxButtonProps> = ({
  value,
  onClick,
  precision = 4,
  token,
  dataAttribute,
  label = t(translations.common.max),
  chainId,
}) => (
  <button
    type="button"
    onClick={onClick}
    className="text-xs font-medium underline whitespace-nowrap"
    {...applyDataAttr(dataAttribute)}
  >
    {`(${label} `}
    <AmountRenderer
      value={value}
      precision={precision}
      suffix={getTokenDisplayName(token, chainId)}
      useTooltip={false}
    />
    {`)`}
  </button>
);
