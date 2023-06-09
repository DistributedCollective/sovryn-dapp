import React, { ReactNode } from 'react';

import classNames from 'classnames';

import { applyDataAttr } from '../../utils';
import styles from './Paragraph.module.css';
import { ParagraphSize, ParagraphStyle } from './Paragraph.types';

export type ParagraphProps = {
  /**
   * The content to render inside the paragraph.
   */
  children: ReactNode;
  /**
   * The size of the paragraph.
   * @default ParagraphSize.small
   */
  size?: ParagraphSize;
  /**
   * The style of the paragraph.
   * @default ParagraphStyle.normal
   */
  style?: ParagraphStyle;
  /**
   * The class name to apply to the paragraph.
   */
  className?: string;
  /**
   * The data attribute to apply to the paragraph.
   */
  dataAttribute?: string;
};

export const Paragraph: React.FC<ParagraphProps> = ({
  children,
  size = ParagraphSize.small,
  style = ParagraphStyle.normal,
  className,
  dataAttribute,
}) => (
  <p
    className={classNames(
      styles.paragraph,
      styles[size],
      styles[style],
      className,
    )}
    {...applyDataAttr(dataAttribute)}
  >
    {children}
  </p>
);
