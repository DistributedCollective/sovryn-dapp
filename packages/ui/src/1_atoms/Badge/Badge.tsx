import React, { FC, PropsWithChildren, ReactNode } from 'react';

import classNames from 'classnames';

import { DATA_ATTRIBUTE } from '../../utils/constants';
import styles from './Badge.module.css';
import { BadgeSize, BadgeStyle } from './Badge.types';

export type BadgeProps = {
  content: ReactNode;
  className?: string;
  style?: BadgeStyle;
  size?: BadgeSize;
  dataLayoutId?: string;
};

export const Badge: FC<PropsWithChildren<BadgeProps>> = ({
  content,
  className,
  style = BadgeStyle.gray,
  size = BadgeSize.sm,
  dataLayoutId,
}) => {
  return (
    <span
      className={classNames(
        className,
        styles.badge,
        styles[style],
        styles[size],
      )}
      {...{ [DATA_ATTRIBUTE]: dataLayoutId }}
    >
      {content}
    </span>
  );
};
