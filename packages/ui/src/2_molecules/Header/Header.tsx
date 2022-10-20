import React, { FC, ReactNode } from 'react';

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
}) => {
  return (
    <header data-layout-id={dataLayoutId} className={styles.header}>
      <div>
        {logo}
        {menuItems && <div className={styles.menuItems}>{menuItems}</div>}
      </div>
      {secondaryContent && <div>{secondaryContent}</div>}
    </header>
  );
};
