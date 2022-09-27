import { FC, PropsWithChildren } from 'react';

import styles from './DialogBody.module.css';

export const DialogBody: FC<PropsWithChildren> = ({ children }) => {
  return <main className={styles.container}>{children}</main>;
};
