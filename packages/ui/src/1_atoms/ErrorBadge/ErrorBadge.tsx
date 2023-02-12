import React, { FC } from 'react';

import classNames from 'classnames';

import { applyDataAttr } from '../../utils';
import styles from './ErrorBadge.module.css';
import { ErrorData } from './ErrorBadge.types';
import { getIcon } from './ErrorBadge.utils';

export type ErrorBadgeProps = ErrorData & {
  dataAttribute?: string;
};

export const ErrorBadge: FC<ErrorBadgeProps> = ({
  level,
  message,
  dataAttribute,
  className,
}) => (
  <div
    className={classNames(styles.error, styles[level.toLowerCase()], className)}
  >
    <div>{getIcon(level)}</div>
    <div {...applyDataAttr(dataAttribute)} className={styles.message}>
      {message}
    </div>
  </div>
);
