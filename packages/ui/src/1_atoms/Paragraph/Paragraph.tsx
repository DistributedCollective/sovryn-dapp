import React, { ReactNode } from 'react';

import classNames from 'classnames';

import styles from './Paragraph.module.css';
import {
  ParagraphSize,
  ParagraphStyle,
  ParagraphType,
} from './Paragraph.types';

export type ParagraphProps = {
  children: ReactNode;
  type?: ParagraphType;
  size?: ParagraphSize;
  style?: ParagraphStyle;
  className?: string;
};

export const Paragraph: React.FC<ParagraphProps> = ({
  children,
  type = ParagraphType.medium,
  size = ParagraphSize.small,
  style = ParagraphStyle.normal,
  className,
}) => (
  <p
    className={classNames(
      styles.paragraph,
      styles[type],
      styles[size],
      styles[style],
      className,
    )}
  >
    {children}
  </p>
);
