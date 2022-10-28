import React, { ReactNode, forwardRef, LegacyRef } from 'react';

import classNames from 'classnames';

import { Icon } from '../../1_atoms/Icon/Icon';
import { DATA_ATTRIBUTE } from '../../utils/constants';
import styles from './WalletContainer.module.css';

type WalletContainerProps = {
  name: string;
  icon?: ReactNode;
  tooltip?: string;
  className?: string;
  dataLayoutId?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const WalletContainer = forwardRef<
  HTMLButtonElement,
  WalletContainerProps
>(({ name, icon, tooltip, className, dataLayoutId, ...buttonProps }, ref) => {
  return (
    <button
      ref={ref as LegacyRef<HTMLButtonElement>}
      {...{ [DATA_ATTRIBUTE]: dataLayoutId }}
      className={classNames(className, styles.walletContainer)}
      {...buttonProps}
    >
      <div className={styles.label}>
        {name}
        {tooltip && <Icon icon="info" size={10} />}
      </div>{' '}
      {icon && <div className={styles.icon}>{icon}</div>}
    </button>
  );
});
