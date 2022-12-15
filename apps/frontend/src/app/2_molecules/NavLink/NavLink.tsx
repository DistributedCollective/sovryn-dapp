import React, { FC } from 'react';

import classNames from 'classnames';
import { NavLink as BaseNavLink, NavLinkProps } from 'react-router-dom';

import styles from './NavLink.module.css';

export const NavLink: FC<NavLinkProps> = ({ className, ...props }) => {
  return (
    <li>
      <BaseNavLink
        {...props}
        className={({ isActive }) =>
          classNames(
            styles.navLink,
            {
              [styles.active]: isActive,
            },
            className,
          )
        }
      />
    </li>
  );
};
