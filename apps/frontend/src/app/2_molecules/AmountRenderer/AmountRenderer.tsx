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

  const countUpValues = useMemo(() => {
    const endValue = decimalic(value).toString();

    const [whole = '', decimals = ''] = endValue.split('.');
    const end = parseFloat(
      (whole ?? 0) + '.' + (decimals ?? 0).slice(0, precision),
    );

    return {
      end,
      decimals: getDecimalPartLength(end),
    };
  }, [precision, value]);

  const localeFormattedValue = useMemo(
    () => formatValue(value, precision),
    [value, precision],
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
      <span className={className}>
        {isAnimated ? (
          <CountUp
            start={0}
            end={countUpValues.end}
            decimals={countUpValues.decimals}
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
