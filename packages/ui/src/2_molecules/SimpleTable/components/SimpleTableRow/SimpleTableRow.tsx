import React, { FC, ReactNode } from 'react';

import classNames from 'classnames';

import { DATA_ATTRIBUTE } from '../../../../utils/constants';
import styles from './SimpleTableRow.module.css';

type SimpleTableRowProps = {
  className?: string;
  dataLayoutId?: string;
  label: ReactNode;
  value: ReactNode;
};

export const SimpleTableRow: FC<SimpleTableRowProps> = ({
  className,
  dataLayoutId,
  label,
  value,
}) => (
  <div
    className={classNames(styles.row, className)}
    {...{ [DATA_ATTRIBUTE]: dataLayoutId }}
  >
    <span>{label}</span>
    <span className={styles.value}>{value}</span>
  </div>
);
