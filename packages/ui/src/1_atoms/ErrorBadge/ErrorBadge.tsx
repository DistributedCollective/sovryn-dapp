import React, { FC } from 'react';

import classNames from 'classnames';

import { applyDataAttr } from '../../utils';
import styles from './ErrorBadge.module.css';
import { ErrorBadgeProps } from './ErrorBadge.types';
import { getIcon } from './ErrorBadge.utils';

export const ErrorBadge: FC<ErrorBadgeProps> = ({
  level,
  message,
  dataAttribute,
  className,
}) => (
  <div
    {...applyDataAttr(dataAttribute)}
    className={classNames(styles.error, styles[level.toLowerCase()], className)}
  >
    <div>{getIcon(level)}</div>
    <div
      {...applyDataAttr(`${dataAttribute}-message`)}
      className={styles.message}
    >
      {message}
    </div>
  </div>
);
