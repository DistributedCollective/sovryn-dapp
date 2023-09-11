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
import { Decimalish } from '@sovryn/utils';

import { useNotificationContext } from '../../../contexts/NotificationContext';
import { translations } from '../../../locales/i18n';
import {
  formatValue,
  getDecimalPartLength,
  getLocaleSeparators,
  decimalic,
} from '../../../utils/math';

const { decimal, thousand } = getLocaleSeparators();

type AmountRendererProps = {
  value: Decimalish;
  precision?: number;
  className?: string;
  suffix?: string;
  prefix?: string;
  dataAttribute?: string;
  isAnimated?: boolean;
  useTooltip?: boolean;
  showRoundingPrefix?: boolean;
  trigger?: TooltipTrigger;
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
  trigger = TooltipTrigger.click,
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

  const calculateDecimalPlaces = useCallback(
    (value: Decimalish, precision: number) => {
      const decimalValue = decimalic(value).toString();
      const [, decimals = ''] = decimalValue.split('.');
      const nonZeroIndex = decimals.search(/[^0]/);
      return nonZeroIndex !== -1
        ? Math.max(nonZeroIndex + 1, precision)
        : precision;
    },
    [],
  );

  const calculatedPrecision = useMemo(
    () => calculateDecimalPlaces(value, precision),
    [value, precision, calculateDecimalPlaces],
  );

  const isValueBetweenZeroAndOne = useCallback((value: number) => {
    const isGreaterThanZero = value > 0;
    const isLessThanOne = value < 1;
    return isGreaterThanZero && isLessThanOne;
  }, []);

  const countUpValues = useMemo(() => {
    const endValue = decimalic(value).toString();
    const [whole = '', decimals = ''] = endValue.split('.');
    const checkPrecision =
      Number(whole) < 1 && Number(whole) > 0 ? calculatedPrecision : precision;
    const end = parseFloat(
      (whole ?? 0) + '.' + (decimals ?? 0).slice(0, checkPrecision),
    );

    return {
      end,
      decimals: getDecimalPartLength(end),
    };
  }, [calculatedPrecision, value, precision]);

  const localeFormattedValue = useMemo(
    () =>
      formatValue(
        value,
        isValueBetweenZeroAndOne(Number(value))
          ? calculatedPrecision
          : precision,
      ),
    [value, calculatedPrecision, precision, isValueBetweenZeroAndOne],
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
      trigger={trigger}
      dataAttribute={dataAttribute}
    >
      <span className={className}>
        {isAnimated ? (
          <CountUp
            start={0}
            end={countUpValues.end}
            decimals={calculatedPrecision}
            duration={1} //do not set lower than 1 overwise it can cause a bug
            separator={thousand}
            decimal={decimal}
            prefix={shouldShowRoundingPrefix ? '~ ' : ''}
            suffix={` ${suffix.toUpperCase()}`}
          />
        ) : (
          <>
            {shouldShowRoundingPrefix ? '~ ' : ''}
            {prefix}
            {localeFormattedValue} {suffix.toUpperCase()}
          </>
        )}
      </span>
    </Tooltip>
  );
};
