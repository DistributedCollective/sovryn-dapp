import { FC, PropsWithChildren } from 'react';
import styles from './lead.module.css';

export type LeadProps = {
  test: boolean;
};

export const Lead: FC<PropsWithChildren<LeadProps>> = ({ children, test }) => {
  return <h1 className={test ? styles.custom : ''}>{children}</h1>;
};
