import React, { FC, ReactNode } from 'react';

import classNames from 'classnames';

import { applyDataAttr } from '../../../../utils';
import styles from './SimpleTableRow.module.css';

type SimpleTableRowProps = {
  className?: string;
  valueClassName?: string;
  dataAttribute?: string;
  label: ReactNode;
  value: ReactNode;
  onClick?: () => void;
};

export const SimpleTableRow: FC<SimpleTableRowProps> = ({
  className,
  valueClassName,
  dataAttribute,
  label,
  value,
  onClick,
}) => (
  <div
    className={classNames(styles.row, className)}
    onClick={onClick}
    {...applyDataAttr(dataAttribute)}
  >
    <span>{label}</span>
    <span className={classNames(styles.value, valueClassName)}>{value}</span>
  </div>
);
