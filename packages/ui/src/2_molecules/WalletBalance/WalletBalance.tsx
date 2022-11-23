import React, { FC, PropsWithChildren } from 'react';

import { SimpleTable } from '../SimpleTable';
import styles from './WalletBalance.module.css';

export const WalletBalance: FC<PropsWithChildren> = ({ children }) => (
  <SimpleTable children={children} className={styles.walletBalance} />
);
