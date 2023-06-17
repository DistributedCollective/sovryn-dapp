import React, { FC, ReactNode, useMemo } from 'react';

import classNames from 'classnames';

import { Badge } from '../../1_atoms/Badge/Badge';
import { applyDataAttr } from '../../utils';
import styles from './NavMenuItem.module.css';

const MAX_COUNT_DEFAULT = 99;

type NavMenuItemProps = {
  count?: number;
  onClick?: () => void;
  /**
   * The content of the menu item.
   * */
  children: ReactNode;
  isActive?: boolean;
  className?: string;
  dataAttribute?: string;
  maxCount?: number;
};

export const NavMenuItem: FC<NavMenuItemProps> = ({
  count,
  onClick,
  children,
  isActive,
  className,
  dataAttribute,
  maxCount = MAX_COUNT_DEFAULT,
}) => {
  const formattedCount = useMemo(
    () => (count && count > maxCount ? `${maxCount}+` : count),
    [count, maxCount],
  );

  return (
    <button
      type="button"
      {...applyDataAttr(dataAttribute)}
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
