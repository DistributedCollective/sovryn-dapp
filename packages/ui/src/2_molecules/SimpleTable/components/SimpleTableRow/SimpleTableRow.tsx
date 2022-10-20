import React, { FC, ReactNode } from 'react';

import classNames from 'classnames';

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
}) => {
  return (
    <div
      className={classNames(styles.row, className)}
      data-layout-id={dataLayoutId}
    >
      <span>{label}</span>
      <span className={styles.value}>{value}</span>
    </div>
  );
};
