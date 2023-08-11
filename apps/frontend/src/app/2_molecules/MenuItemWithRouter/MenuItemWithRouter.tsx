import React, { FC, ReactNode } from 'react';

import classNames from 'classnames';
import { NavLink } from 'react-router-dom';

import { Icon, IconType, applyDataAttr } from '@sovryn/ui';

import styles from './MenuItemWithRouter.module.css';

type MenuItemWithRouterProps = {
  className?: string;
  icon?: IconType;
  text: ReactNode;
  label?: ReactNode;
  disabled?: boolean;
  isActive?: boolean;
  dataAttribute?: string;
  link: string;
};

export const MenuItemWithRouter: FC<MenuItemWithRouterProps> = ({
  className,
  icon,
  text,
  label,
  disabled,
  isActive,
  dataAttribute,
  link,
}) => (
  <li
    className={classNames(styles.host, className)}
    {...applyDataAttr(dataAttribute)}
  >
    <NavLink
      to={link}
      className={classNames(styles.button, className, {
        [styles.disabled]: disabled,
        [styles.active]: isActive,
      })}
    >
      <div className={styles.hostBlock}>
        <div className={styles.hostFlex}>
          {icon && <Icon icon={icon} className={styles.icon} />}
          <span className={classNames(styles.text)}>{text}</span>
        </div>
        {label && <span className={styles.label}>{label}</span>}
      </div>
    </NavLink>
  </li>
);
