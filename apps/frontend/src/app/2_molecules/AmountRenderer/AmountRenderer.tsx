import React, { FC, useCallback, useMemo } from 'react';

import { t } from 'i18next';
import { nanoid } from 'nanoid';

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
};

export const AmountRenderer: FC<AmountRendererProps> = ({
  value,
  className,
  precision = 4,
  suffix = '',
  prefix = '',
  dataAttribute,
}) => {
  const { addNotification } = useNotificationContext();
  const copyAddress = useCallback(async () => {
    await navigator.clipboard.writeText(String(value));
    addNotification({
      type: NotificationType.success,
      title: t(translations.copyAddress),
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

  return (
    <Tooltip
      content={
        <span className="flex items-center">
          {`${prefix} ${value} ${suffix}`}
          <span
            className="ml-1 cursor-pointer hover:bg-gray-20 p-1 rounded text-gray-50"
            onClick={copyAddress}
          >
            <Icon icon={IconNames.COPY} />
          </span>
        </span>
      }
      disabled={tooltipDisabled}
      trigger={TooltipTrigger.click}
      dataAttribute={dataAttribute}
    >
      <span className={className}>
        {`${prefix} ${!tooltipDisabled ? '~' : ''}${formattedValue} ${suffix}`}
      </span>
    </Tooltip>
  );
};
