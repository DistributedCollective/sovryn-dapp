import React, { useCallback, useMemo } from 'react';

import classNames from 'classnames';

import { Icon } from '../../1_atoms';
import { COPY, NEW_TAB } from '../../1_atoms/Icon/iconNames';
import { Tooltip } from '../Tooltip/Tooltip';
import { TooltipPlacement } from '../Tooltip/Tooltip.types';
import styles from './TransactionID.module.css';

export const chains = {
  mainnet: 30,
  testnet: 31,
};

export const currentChainId = chains.mainnet;

export enum ChainId {
  ETH_MAINNET = 1,
  ETH_TESTNET = 3, // Ropsten
  ETH_RINKEBY = 4,
  RSK_MAINNET = 30,
  RSK_TESTNET = 31,
  BSC_MAINNET = 56,
  BSC_TESTNET = 97,
  MATIC_MAINNET = 137, // Polygon
  MATIC_TESTNET = 80001,
}

export const blockExplorers = {
  1: 'https://etherscan.io',
  3: 'https://ropsten.etherscan.io',
  30: 'https://explorer.rsk.co',
  31: 'https://explorer.testnet.rsk.co',
  btc_30: 'https://live.blockcypher.com/btc',
  btc_31: 'https://live.blockcypher.com/btc-testnet',
  56: 'https://bscscan.com',
  97: 'https://testnet.bscscan.com',
};

interface TransactionIDProps {
  value: string;
  startLength?: number;
  endLength?: number;
  className?: string;
  hideTooltip?: boolean;
  chainId?: number | ChainId;
  dataActionId?: string;
  isNativeBtc?: boolean;
  isAddress?: boolean;
}

export const TransactionID: React.FC<TransactionIDProps> = ({
  startLength = 6,
  endLength = 4,
  className,
  hideTooltip,
  chainId,
  dataActionId,
  isNativeBtc,
  isAddress,
  ...props
}) => {
  const value = useMemo(() => {
    if (props.value?.length && startLength && endLength) {
      const start = props.value.substr(0, startLength);
      const end = props.value.substr(-endLength);
      return `${start} ··· ${end}`;
    }
    return props.value;
  }, [props.value, startLength, endLength]);

  const url = useMemo(() => {
    if (isNativeBtc) {
      return blockExplorers[`btc_${currentChainId}`];
    }
    return blockExplorers[chainId || currentChainId];
  }, [isNativeBtc, chainId]);

  const copyAddress = useCallback(async () => {
    await navigator.clipboard.writeText(props.value);
    alert('Address was copied to clipboard.');
  }, [props.value]);

  return (
    <Tooltip
      content={
        <span className="flex items-center">
          {props.value}
          <span className={styles.icon} onClick={copyAddress}>
            <Icon icon={COPY} />
          </span>
          <a
            className={styles.icon}
            href={
              isAddress
                ? `${url}/address/${props.value}`
                : `${url}/tx/${props.value}`
            }
            target="_blank"
            rel="noreferrer noopener"
          >
            <Icon icon={NEW_TAB} />
          </a>
        </span>
      }
      className={classNames(styles.link, className)}
      tooltipClassName={styles.tooltip}
      dataActionId={dataActionId}
      placement={TooltipPlacement.BOTTOM_END}
    >
      <div>{value}</div>
    </Tooltip>
  );
};
