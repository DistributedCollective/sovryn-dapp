import React, { ReactNode } from 'react';

import classNames from 'classnames';

import { applyDataAttr } from '../../utils';
import styles from './Paragraph.module.css';
import { ParagraphSize, ParagraphStyle } from './Paragraph.types';

export type ParagraphProps = {
  children: ReactNode;
  size?: ParagraphSize;
  style?: ParagraphStyle;
  className?: string;
  dataLayoutId?: string;
};

export const Paragraph: React.FC<ParagraphProps> = ({
  children,
  size = ParagraphSize.small,
  style = ParagraphStyle.normal,
  className,
  dataLayoutId,
}) => (
  <p
    className={classNames(
      styles.paragraph,
      styles[size],
      styles[style],
      className,
    )}
    {...applyDataAttr(dataLayoutId)}
  >
    {children}
  </p>
);
