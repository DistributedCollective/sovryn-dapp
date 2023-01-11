import React, { ReactNode, forwardRef, LegacyRef } from 'react';

import classNames from 'classnames';

import { Icon } from '../../1_atoms/Icon/Icon';
import { applyDataAttr } from '../../utils';
import styles from './WalletContainer.module.css';

type WalletContainerProps = {
  name: string;
  icon?: ReactNode;
  tooltip?: string;
  className?: string;
  dataAttribute?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const WalletContainer = forwardRef<
  HTMLButtonElement,
  WalletContainerProps
>(({ name, icon, tooltip, className, dataAttribute, ...buttonProps }, ref) => {
  return (
    <button
      ref={ref as LegacyRef<HTMLButtonElement>}
      {...applyDataAttr(dataAttribute)}
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
