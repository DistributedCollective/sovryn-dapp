import React from 'react';

import { Tooltip, TooltipTrigger } from '@sovryn/ui';

import { formatValue } from '../../../../../utils/math';

type AmountRendererProps = {
  amount: string;
  asset: string;
};

export const AmountRenderer: React.FC<AmountRendererProps> = ({
  amount,
  asset,
}) => (
  <Tooltip
    content={<span>{`${formatValue(Number(amount), 18)} ${asset}`}</span>}
    trigger={TooltipTrigger.click}
    className="cursor-pointer uppercase"
    tooltipClassName="uppercase"
    dataAttribute="conversion-sent-tooltip"
  >
    <span>{`${formatValue(Number(amount), 6)} ${asset}`}</span>
  </Tooltip>
);
