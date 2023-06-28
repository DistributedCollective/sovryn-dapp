import React, { ReactNode, forwardRef, LegacyRef } from 'react';

import classNames from 'classnames';

import { applyDataAttr } from '../../utils';
import { HelperButton } from '../HelperButton';
import styles from './WalletContainer.module.css';

type WalletContainerProps = {
  name: string;
  icon?: ReactNode;
  helper?: string;
  className?: string;
  dataAttribute?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const WalletContainer = forwardRef<
  HTMLButtonElement,
  WalletContainerProps
>(({ name, icon, helper, className, dataAttribute, ...buttonProps }, ref) => {
  return (
    <button
      ref={ref as LegacyRef<HTMLButtonElement>}
      {...applyDataAttr(dataAttribute)}
      className={classNames(className, styles.walletContainer)}
      {...buttonProps}
    >
      <div className={styles.label}>
        {name}
        {helper && <HelperButton className="ml-1" content={helper} />}
      </div>{' '}
      {icon && <div className={styles.icon}>{icon}</div>}
    </button>
  );
});
