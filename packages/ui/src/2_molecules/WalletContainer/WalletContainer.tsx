import React, { FC, ReactNode } from 'react';

import classNames from 'classnames';

import { Icon } from '../../1_atoms/Icon/Icon';
import styles from './WalletContainer.module.css';

type WalletContainerProps = {
  name: string;
  icon?: ReactNode;
  tooltip?: string;
  className?: string;
  dataLayoutId?: string;
};

export const WalletContainer: FC<WalletContainerProps> = ({
  name,
  icon,
  tooltip,
  className,
  dataLayoutId,
}) => {
  return (
    <div
      data-layout-id={dataLayoutId}
      className={classNames(className, styles.walletContainer)}
    >
      <div className={styles.label}>
        {name}
        {tooltip && <Icon icon="info" size={10} />}
      </div>{' '}
      {icon && <div className={styles.icon}>{icon}</div>}
    </div>
  );
};
