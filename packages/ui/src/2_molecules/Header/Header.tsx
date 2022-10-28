import React, { FC, ReactNode } from 'react';

import { DATA_ATTRIBUTE } from '../../types';
import styles from './Header.module.css';

type HeaderProps = {
  dataLayoutId?: string;
  logo?: ReactNode;
  menuItems?: ReactNode;
  secondaryContent?: ReactNode;
};

export const Header: FC<HeaderProps> = ({
  dataLayoutId,
  logo,
  menuItems,
  secondaryContent,
}) => (
  <header {...{ [DATA_ATTRIBUTE]: dataLayoutId }} className={styles.header}>
    <div>
      {logo && <div className={styles.logo}>{logo}</div>}
      {menuItems && <div className={styles.menuItems}>{menuItems}</div>}
    </div>
    {secondaryContent && <div>{secondaryContent}</div>}
  </header>
);
