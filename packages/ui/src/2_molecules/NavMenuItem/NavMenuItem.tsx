import React, { FC, ReactNode, useMemo } from 'react';

import classNames from 'classnames';

import { Badge } from '../../1_atoms/Badge/Badge';
import styles from './NavMenuItem.module.css';

const MAX_COUNT_DEFAULT = 99;

type NavMenuItemProps = {
  count?: number;
  onClick?: () => void;
  children: ReactNode;
  isActive?: boolean;
  className?: string;
  dataLayoutId?: string;
  maxCount?: number;
};

export const NavMenuItem: FC<NavMenuItemProps> = ({
  count,
  onClick,
  children,
  isActive,
  className,
  dataLayoutId,
  maxCount = MAX_COUNT_DEFAULT,
}) => {
  const formattedCount = useMemo(
    () => (count && count > maxCount ? `${maxCount}+` : count),
    [count, maxCount],
  );

  return (
    <button
      type="button"
      data-layout-id={dataLayoutId}
      onClick={onClick}
      className={classNames(styles.navMenuItem, className, {
        [styles.active]: isActive,
        [styles.count]: formattedCount,
      })}
    >
      {children}
      {formattedCount && <Badge content={formattedCount} />}
    </button>
  );
};
