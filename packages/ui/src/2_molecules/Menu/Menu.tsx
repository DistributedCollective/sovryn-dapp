import React, { ReactNode } from 'react';

export * from './components/MenuItem/MenuItem';
export * from './components/MenuSeparator/MenuSeparator';

type MenuProps = {
  className?: string;
  children?: ReactNode;
};

export const Menu: React.FC<MenuProps> = ({ className, children }) => (
  <ul className={className}>{children}</ul>
);
