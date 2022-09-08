import { FC, ReactNode } from 'react';

type MenuProps = {
  className?: string;
  children?: ReactNode;
};

export const Menu: FC<MenuProps> = ({ className, children }) => (
  <ul className={className}>{children}</ul>
);
