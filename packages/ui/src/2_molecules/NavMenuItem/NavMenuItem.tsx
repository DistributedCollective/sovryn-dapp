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
  dataActionId?: string;
  maxNotificationsCount?: number;
};

export const NavMenuItem: FC<NavMenuItemProps> = ({
  count,
  onClick,
  children,
  isActive,
  className,
  dataActionId,
  maxNotificationsCount = MAX_COUNT_DEFAULT,
}) => {
  const formattedCount = useMemo(
    () =>
      count && count > maxNotificationsCount
        ? `${maxNotificationsCount}+`
        : count,
    [count],
  );

  return (
    <button
      type="button"
      data-action-id={dataActionId}
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
