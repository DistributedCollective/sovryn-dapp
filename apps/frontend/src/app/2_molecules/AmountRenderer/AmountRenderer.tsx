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
  decimalPartLength,
  formatValue,
  getThousandSeparator,
} from '../../../utils/math';

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

  const decimals = useMemo(() => {
    const decimalCount = decimalPartLength(value.toString());
    return decimalCount > precision ? precision : decimalCount;
  }, [value, precision]);

  const tooltipDisabled = useMemo(
    () => precision >= decimalPartLength(value.toString()),
    [precision, value],
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
            separator={getThousandSeparator(value.toString(), precision)}
            decimals={decimals}
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
