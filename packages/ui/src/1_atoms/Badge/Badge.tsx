import React, { FC, PropsWithChildren, ReactNode } from 'react';

import classNames from 'classnames';

import styles from './Badge.module.css';
import { BadgeSize, BadgeStyle } from './Badge.types';

export type BadgeProps = {
  content: ReactNode;
  className?: string;
  style?: BadgeStyle;
  size?: BadgeSize;
  dataActionId?: string;
};

export const Badge: FC<PropsWithChildren<BadgeProps>> = ({
  content,
  className,
  style = BadgeStyle.gray,
  size = BadgeSize.sm,
  dataActionId,
}) => {
  return (
    <span
      className={classNames(
        className,
        styles.badge,
        styles[style],
        styles[size],
      )}
      data-action-id={dataActionId}
    >
      {content}
    </span>
  );
};
