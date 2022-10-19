import React, { useCallback, useMemo } from 'react';

import classNames from 'classnames';

import { Icon } from '../../1_atoms';
import { COPY, NEW_TAB } from '../../1_atoms/Icon/iconNames';
import { Tooltip } from '../Tooltip/Tooltip';
import { TooltipPlacement, TooltipTrigger } from '../Tooltip/Tooltip.types';
import styles from './TransactionId.module.css';
import { blockExplorers, ChainId, currentChainId } from './TransactionId.types';

type TransactionIdProps = {
  value: string;
  startLength?: number;
  endLength?: number;
  className?: string;
  hideTooltip?: boolean;
  chainId?: number | ChainId;
  dataLayoutId?: string;
  isNativeBtc?: boolean;
  isAddress?: boolean;
};

export const TransactionId: React.FC<TransactionIdProps> = ({
  startLength = 6,
  endLength = 4,
  className,
  hideTooltip,
  chainId,
  dataLayoutId,
  isNativeBtc,
  isAddress,
  value,
}) => {
  const formattedValue = useMemo(() => {
    if (value?.length && startLength && endLength) {
      const start = value.substr(0, startLength);
      const end = value.substr(-endLength);
      return `${start} ··· ${end}`;
    }
    return value;
  }, [value, startLength, endLength]);

  const blockExplorerUrl = useMemo(() => {
    if (isNativeBtc) {
      return blockExplorers[`btc_${currentChainId}`];
    }
    return blockExplorers[chainId || currentChainId];
  }, [isNativeBtc, chainId]);

  const copyAddress = useCallback(async () => {
    await navigator.clipboard.writeText(value);
    alert('Address was copied to clipboard.');
  }, [value]);

  return (
    <Tooltip
      content={
        <span className="flex items-center">
          {value}
          <span
            data-layout-id="transaction-copy"
            className={styles.icon}
            onClick={copyAddress}
          >
            <Icon icon={COPY} />
          </span>
          <a
            className={styles.icon}
            href={
              isAddress
                ? `${blockExplorerUrl}/address/${value}`
                : `${blockExplorerUrl}/tx/${value}`
            }
            target="_blank"
            rel="noreferrer noopener"
            data-layout-id="transaction-link"
          >
            <Icon icon={NEW_TAB} />
          </a>
        </span>
      }
      trigger={TooltipTrigger.click}
      className={classNames(styles.link, className)}
      tooltipClassName={styles.tooltip}
      placement={TooltipPlacement.bottom}
      disabled={hideTooltip}
      dataLayoutId={dataLayoutId}
    >
      <div>{formattedValue}</div>
    </Tooltip>
  );
};
