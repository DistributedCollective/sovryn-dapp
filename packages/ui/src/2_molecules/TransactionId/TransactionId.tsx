import React, { useCallback, useMemo } from 'react';

import classNames from 'classnames';

import { Tooltip } from '..';
import { Icon, Link } from '../../1_atoms';
import { IconNames } from '../../1_atoms/Icon/Icon.types';
import { LinkStyle } from '../../1_atoms/Link/Link.types';
import { prettyTx } from '../../utils';
import { TooltipPlacement, TooltipTrigger } from '../Tooltip/Tooltip.types';
import styles from './TransactionId.module.css';

export type TransactionIdProps = {
  value: string;
  startLength?: number;
  endLength?: number;
  className?: string;
  hideTooltip?: boolean;
  dataLayoutId?: string;
  href: string;
};

export const TransactionId: React.FC<TransactionIdProps> = ({
  startLength = 6,
  endLength = 4,
  className,
  hideTooltip,
  dataLayoutId,
  value,
  href,
}) => {
  const formattedValue = useMemo(() => {
    if (value?.length && startLength && endLength) {
      return prettyTx(value, startLength, endLength);
    }
    return value;
  }, [value, startLength, endLength]);

  const copyAddress = useCallback(async () => {
    await navigator.clipboard.writeText(value);
    alert('Address was copied to clipboard.');
  }, [value]);

  return hideTooltip ? (
    <Link
      className={classNames(styles.link, className)}
      href={href}
      text={formattedValue}
      dataLayoutId={dataLayoutId}
    />
  ) : (
    <Tooltip
      content={
        <span className="flex items-center">
          {value}
          <span
            data-layout-id="transaction-copy"
            className={styles.icon}
            onClick={copyAddress}
          >
            <Icon icon={IconNames.COPY} />
          </span>
          <Link
            className={styles.icon}
            href={href}
            text={<Icon icon={IconNames.NEW_TAB} />}
            dataLayoutId="transaction-link"
            style={LinkStyle.custom}
          />
        </span>
      }
      trigger={TooltipTrigger.click}
      className={classNames(styles.link, className)}
      tooltipClassName={styles.tooltip}
      placement={TooltipPlacement.bottom}
      dataLayoutId={dataLayoutId}
      activeClassName={styles.active}
    >
      <div>{formattedValue}</div>
    </Tooltip>
  );
};
