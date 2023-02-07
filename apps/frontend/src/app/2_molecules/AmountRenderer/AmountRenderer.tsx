import React, { FC, useCallback, useMemo } from 'react';

import { Icon, IconNames, Tooltip, TooltipTrigger } from '@sovryn/ui';

import { formatValue } from '../../../utils/math';

type AmountRendererProps = {
  value: string | number;
  precision?: number;
  className?: string;
  sufix?: string;
  prefix?: string;
  dataAttribute?: string;
};

export const AmountRenderer: FC<AmountRendererProps> = ({
  value,
  className,
  precision = 4,
  sufix = '',
  prefix = '',
  dataAttribute,
}) => {
  const copyAddress = useCallback(async () => {
    await navigator.clipboard.writeText(String(value));
    alert('Address was copied to clipboard.');
  }, [value]);
  const formattedValue = useMemo(
    () => formatValue(Number(value), precision),
    [precision, value],
  );

  const tooltipDisabled = useMemo(
    () => Number(formattedValue.split(',').join('')) === Number(value),
    [formattedValue, value],
  );

  return (
    <Tooltip
      content={
        <span className="flex items-center">
          {`${prefix} `} {value} {` ${sufix}`}
          <span
            className="ml-1 cursor-pointer hover:bg-gray-20 p-1 rounded text-gray-50"
            onClick={copyAddress}
          >
            <Icon icon={IconNames.COPY} />
          </span>
        </span>
      }
      disabled={tooltipDisabled}
      trigger={TooltipTrigger.hover}
      dataAttribute={dataAttribute}
    >
      <span className={className}>
        {`${prefix} `}
        {!tooltipDisabled ? '~' : ''}
        {formattedValue} {` ${sufix}`}
      </span>
    </Tooltip>
  );
};
