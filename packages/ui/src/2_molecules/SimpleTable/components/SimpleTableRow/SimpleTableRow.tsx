import React, { FC, ReactNode } from 'react';

import classNames from 'classnames';

import { applyDataAttr } from '../../../../utils';
import styles from './SimpleTableRow.module.css';

type SimpleTableRowProps = {
  className?: string;
  valueClassName?: string;
  dataLayoutId?: string;
  label: ReactNode;
  value: ReactNode;
};

export const SimpleTableRow: FC<SimpleTableRowProps> = ({
  className,
  valueClassName,
  dataLayoutId,
  label,
  value,
}) => (
  <div
    className={classNames(styles.row, className)}
    {...applyDataAttr(dataLayoutId)}
  >
    <span>{label}</span>
    <span className={classNames(styles.value, valueClassName)}>{value}</span>
  </div>
);
