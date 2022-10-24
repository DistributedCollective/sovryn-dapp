import React, { ReactNode } from 'react';

import classNames from 'classnames';

import styles from './Menu.module.css';

type MenuProps = {
  className?: string;
  children?: ReactNode;
};

export const Menu: React.FC<MenuProps> = ({ className, children }) => (
  <ul className={classNames(className, styles.menu)}>{children}</ul>
);
