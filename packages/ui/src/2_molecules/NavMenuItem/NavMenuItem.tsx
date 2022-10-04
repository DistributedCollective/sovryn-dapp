import React, { FC, ReactNode, useMemo, useRef } from 'react';

import classNames from 'classnames';

import { Badge } from '../../1_atoms/Badge/Badge';
import styles from './NavMenuItem.module.css';

const MAX_NOTIFICATIONS_COUNT = 99;

type NavMenuItemProps = {
  count?: number;
  onClick?: () => void;
  children: ReactNode;
  isActive?: boolean;
  className?: string;
  dataActionId?: string;
};

export const NavMenuItem: FC<NavMenuItemProps> = ({
  count,
  onClick,
  children,
  isActive,
  className,
  dataActionId,
}) => {
  const ref = useRef<HTMLButtonElement>(null);
  const formattedCount = useMemo(
    () =>
      count && count > MAX_NOTIFICATIONS_COUNT
        ? MAX_NOTIFICATIONS_COUNT
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
      ref={ref}
    >
      {children}
      {formattedCount && <Badge content={formattedCount} />}
    </button>
  );
};
