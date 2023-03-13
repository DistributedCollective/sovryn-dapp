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
import {
  formatValue,
  getDecimalPartLength,
  getLocaleSeparators,
} from '../../../utils/math';

const { decimal, thousand } = getLocaleSeparators();

type AmountRendererProps = {
  value: string | number;
  precision?: number;
  className?: string;
  suffix?: string;
  prefix?: string;
  dataAttribute?: string;
  isAnimated?: boolean;
  useTooltip?: boolean;
  showRoundingPrefix?: boolean;
};

export const AmountRenderer: FC<AmountRendererProps> = ({
  value,
  className,
  precision = 4,
  suffix = '',
  prefix = '',
  dataAttribute,
  isAnimated = false,
  useTooltip = true,
  showRoundingPrefix = true,
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

  const formattedValue = useMemo(() => {
    const numberValue = Number(value);
    const decimals = getDecimalPartLength(numberValue);

    if (decimals > precision) {
      return Number(numberValue.toString().slice(0, -(decimals - precision))); // trimming the difference between the number of decimals we have and the precision we want, cannot use toFixed() as we need to round down
    }
    return numberValue;
  }, [precision, value]);

  const localeFormattedValue = useMemo(
    () => formatValue(formattedValue, precision), // we need to format formattedValue to make sure we round down (formatValue function rounds up)
    [formattedValue, precision],
  );

  const formattedValueDecimals = useMemo(
    () => getDecimalPartLength(formattedValue),
    [formattedValue],
  );

  const valueIsRounded = useMemo(
    () => getDecimalPartLength(value) > precision,
    [precision, value],
  );

  const shouldShowRoundingPrefix = useMemo(
    () => valueIsRounded && showRoundingPrefix,
    [valueIsRounded, showRoundingPrefix],
  );

  const shouldShowTooltip = useMemo(
    () => useTooltip && valueIsRounded,
    [useTooltip, valueIsRounded],
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
        'cursor-pointer': shouldShowTooltip,
      })}
      disabled={!shouldShowTooltip}
      trigger={TooltipTrigger.click}
      dataAttribute={dataAttribute}
    >
      {isAnimated ? (
        <div>
          <CountUp
            start={0}
            end={formattedValue}
            duration={0.7}
            separator={thousand}
            decimals={formattedValueDecimals}
            decimal={decimal}
            prefix={shouldShowRoundingPrefix ? '~ ' : ''}
            suffix={` ${suffix.toUpperCase()}`}
          />
        </div>
      ) : (
        <span className={className}>
          {`${
            shouldShowRoundingPrefix ? '~ ' : ''
          }${prefix}${localeFormattedValue} ${suffix.toUpperCase()}`}
        </span>
      )}
    </Tooltip>
  );
};
