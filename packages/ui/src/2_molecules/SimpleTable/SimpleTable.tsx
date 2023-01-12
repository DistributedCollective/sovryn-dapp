import React, { FC, PropsWithChildren } from 'react';

import classNames from 'classnames';

import { applyDataAttr } from '../../utils';
import styles from './SimpleTable.module.css';

type SimpleTableProps = {
  className?: string;
  dataAttribute?: string;
  border?: boolean;
};

export const SimpleTable: FC<PropsWithChildren<SimpleTableProps>> = ({
  className,
  dataAttribute,
  children,
  border,
}) => (
  <div
    className={classNames(
      styles.simpleTable,
      {
        [styles.withBorder]: border,
      },
      className,
    )}
    {...applyDataAttr(dataAttribute)}
  >
    {children}
  </div>
);
