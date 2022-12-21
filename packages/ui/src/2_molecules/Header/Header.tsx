import React, { FC, ReactNode } from 'react';

import classNames from 'classnames';

import { applyDataAttr } from '../../utils';
import styles from './Header.module.css';

type HeaderProps = {
  dataLayoutId?: string;
  logo?: ReactNode;
  menuItems?: ReactNode;
  secondaryContent?: ReactNode;
  isOpen?: boolean;
  menuIcon?: ReactNode;
  extraContent?: ReactNode;
};

export const Header: FC<HeaderProps> = ({
  dataLayoutId,
  logo,
  menuItems,
  secondaryContent,
  extraContent,
  isOpen,
  menuIcon,
}) => (
  <header {...applyDataAttr(dataLayoutId)} className={styles.header}>
    <div className={styles.leftContent}>
      {logo && <div className={styles.logo}>{logo}</div>}
      {menuIcon && <div className={styles.menuIcon}>{menuIcon}</div>}
      <nav className={classNames(styles.nav, { [styles.navOpen]: isOpen })}>
        {(logo || extraContent) && (
          <div className={styles.mobileContent}>
            {logo && <div className={styles.mobileContentLogo}>{logo}</div>}
            {extraContent && (
              <div className={styles.mobileExtraContent}>{extraContent}</div>
            )}
          </div>
        )}
        {menuItems}
      </nav>
    </div>
    <div className={styles.secondaryContent}>
      <div className={styles.extraContentDesktop}>{extraContent}</div>
      {secondaryContent}
    </div>
  </header>
);
