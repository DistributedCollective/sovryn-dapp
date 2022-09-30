import React, { ReactNode } from 'react';

import classNames from 'classnames';

import styles from './Paragraph.module.css';
import { ParagraphSize, ParagraphStyle } from './Paragraph.types';

export type ParagraphProps = {
  children: ReactNode;
  size?: ParagraphSize;
  style?: ParagraphStyle;
  className?: string;
};

export const Paragraph: React.FC<ParagraphProps> = ({
  children,
  size = ParagraphSize.base,
  style = ParagraphStyle.normal,
  className,
}) => (
  <p
    className={classNames(
      styles.paragraph,
      styles[size],
      styles[style],
      className,
    )}
  >
    {children}
  </p>
);
