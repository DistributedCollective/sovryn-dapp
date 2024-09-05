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
import { Decimal, Decimalish } from '@sovryn/utils';

import { useNotificationContext } from '../../../contexts/NotificationContext';
import { translations } from '../../../locales/i18n';
import {
  formatValue,
  getDecimalPartLength,
  getLocaleSeparators,
  decimalic,
} from '../../../utils/math';
import {
  calculateDecimalPlaces,
  isValueBetweenZeroAndOne,
} from './AmountRenderer.utils';

const { decimal, thousand } = getLocaleSeparators();

export type AmountRendererProps = {
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
  decimals?: number;
  asIf?: boolean;
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
  decimals = 18,
  asIf,
}) => {
  const adjustedValue = useMemo(
    () =>
      !value || value === 0 || value === '0'
        ? Decimal.ZERO
        : asIf
        ? Decimal.from(value)
        : Decimal.from(value).asUnits(decimals),
    [asIf, decimals, value],
  );

  const { addNotification } = useNotificationContext();

  const copyAddress = useCallback(async () => {
    await navigator.clipboard.writeText(String(adjustedValue));

    addNotification({
      type: NotificationType.success,
      title: t(translations.copyAmount),
      content: '',
      dismissible: true,
      id: nanoid(),
    });
  }, [addNotification, adjustedValue]);

  const valueIsRounded = useMemo(
    () => getDecimalPartLength(adjustedValue) > precision,
    [adjustedValue, precision],
  );

  const shouldShowRoundingPrefix = useMemo(
    () => valueIsRounded && showRoundingPrefix,
    [valueIsRounded, showRoundingPrefix],
  );

  const shouldShowTooltip = useMemo(
    () => useTooltip && valueIsRounded,
    [useTooltip, valueIsRounded],
  );

  const calculatedPrecision = useMemo(
    () => calculateDecimalPlaces(adjustedValue, precision),
    [adjustedValue, precision],
  );

  const countUpValues = useMemo(() => {
    const endValue = decimalic(adjustedValue).toString();
    const [whole = '', decimals = ''] = endValue.split('.');
    const checkPrecision = isValueBetweenZeroAndOne(Number(adjustedValue))
      ? calculatedPrecision
      : precision;
    const end = parseFloat(
      (whole ?? 0) + '.' + (decimals ?? 0).slice(0, checkPrecision),
    );

    return {
      end,
      decimals: getDecimalPartLength(end),
    };
  }, [adjustedValue, calculatedPrecision, precision]);

  const localeFormattedValue = useMemo(
    () =>
      formatValue(
        adjustedValue,
        isValueBetweenZeroAndOne(Number(adjustedValue))
          ? calculatedPrecision
          : precision,
      ),
    [adjustedValue, calculatedPrecision, precision],
  );

  return (
    <Tooltip
      content={
        <span className="flex items-center">
          {`${prefix} ${decimalic(adjustedValue)} ${suffix}`}
          <span
            className="ml-1 cursor-pointer hover:bg-gray-20 p-1 rounded text-gray-50"
            onClick={copyAddress}
          >
            <Icon icon={IconNames.COPY} />
          </span>
        </span>
      }
      className={classNames({ 'cursor-pointer': shouldShowTooltip }, className)}
      disabled={!shouldShowTooltip}
      trigger={trigger}
      dataAttribute={dataAttribute}
    >
      {isAnimated ? (
        <CountUp
          start={0}
          end={countUpValues.end}
          decimals={calculatedPrecision}
          duration={1} //do not set lower than 1 overwise it can cause a bug
          separator={thousand}
          decimal={decimal}
          prefix={shouldShowRoundingPrefix ? `~ ${prefix}` : `${prefix}`}
          suffix={` ${suffix}`}
        />
      ) : (
        <span>
          {shouldShowRoundingPrefix ? '~ ' : ''}
          {prefix}
          {localeFormattedValue} {suffix}
        </span>
      )}
    </Tooltip>
  );
};
