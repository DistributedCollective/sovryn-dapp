import React, { FC, useCallback, useMemo } from 'react';

import classNames from 'classnames';
import { t } from 'i18next';
import { nanoid } from 'nanoid';
import CountUp from 'react-countup';

import {
  Icon,
  IconNames,
  NotificationType,
  Tooltip,
  TooltipTrigger,
} from '@sovryn/ui';

import { useNotificationContext } from '../../../contexts/NotificationContext';
import { translations } from '../../../locales/i18n';
import { formatValue } from '../../../utils/math';

type AmountRendererProps = {
  value: string | number;
  precision?: number;
  className?: string;
  suffix?: string;
  prefix?: string;
  dataAttribute?: string;
  isAnimated?: boolean;
};

export const AmountRenderer: FC<AmountRendererProps> = ({
  value,
  className,
  precision = 4,
  suffix = '',
  prefix = '',
  dataAttribute,
  isAnimated = false,
}) => {
  const { addNotification } = useNotificationContext();
  const copyAddress = useCallback(async () => {
    await navigator.clipboard.writeText(String(value));
    addNotification({
      type: NotificationType.success,
      title: t(translations.copyAmount),
      content: '',
      dismissible: true,
      id: nanoid(),
    });
  }, [addNotification, value]);
  const formattedValue = useMemo(
    () => formatValue(Number(value), precision),
    [precision, value],
  );

  const tooltipDisabled = useMemo(
    () => Number(formattedValue.split(',').join('')) === Number(value),
    [formattedValue, value],
  );

  const countDecimalPlaces = useCallback((num, decimals) => {
    let str = (+num).toFixed(decimals); //  Round the number to {decimals} decimal count
    while (str.charAt(str.length - 1) === '0') {
      str = str.slice(0, -1); // remove non-significant zeros
    }
    if (str.charAt(str.length - 1) === '.') {
      str = str.slice(0, -1); // remove a dot if it is at the end of a string
    }
    const decimalPart = str.split('.')[1]; // get the decimal part of the number
    const decimalCount = decimalPart ? decimalPart.length : 0; // count the number of decimals
    return { number: str, decimalCount: decimalCount };
  }, []);

  const decimals = useMemo(
    () =>
      countDecimalPlaces(value, precision).decimalCount > 0
        ? countDecimalPlaces(value, precision).decimalCount
        : 0,
    [value, countDecimalPlaces, precision],
  );

  return (
    <Tooltip
      content={
        <span className="flex items-center">
          {`${prefix} ${value} ${suffix.toUpperCase()}`}
          <span
            className="ml-1 cursor-pointer hover:bg-gray-20 p-1 rounded text-gray-50"
            onClick={copyAddress}
          >
            <Icon icon={IconNames.COPY} />
          </span>
        </span>
      }
      className={classNames({
        'cursor-pointer': !tooltipDisabled,
      })}
      disabled={tooltipDisabled}
      trigger={TooltipTrigger.click}
      dataAttribute={dataAttribute}
    >
      {isAnimated ? (
        <div>
          <CountUp
            start={0}
            end={Number(value)}
            duration={0.7}
            separator=","
            decimals={decimals}
            decimal="."
            prefix={!tooltipDisabled ? '~' : ''}
            suffix={` ${suffix}`}
          />
        </div>
      ) : (
        <span className={className}>
          {`${prefix}${
            !tooltipDisabled ? '~' : ''
          }${formattedValue} ${suffix.toUpperCase()}`}
        </span>
      )}
    </Tooltip>
  );
};
