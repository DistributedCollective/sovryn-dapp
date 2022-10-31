import React, { FC, PropsWithChildren } from 'react';

import classNames from 'classnames';

import styles from './SimpleTable.module.css';

type SimpleTableProps = {
  className?: string;
  dataLayoutId?: string;
  border?: boolean;
};

export const SimpleTable: FC<PropsWithChildren<SimpleTableProps>> = ({
  className,
  dataLayoutId,
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
    data-layout-id={dataLayoutId}
  >
    {children}
  </div>
);
