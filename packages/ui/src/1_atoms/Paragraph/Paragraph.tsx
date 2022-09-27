import React, { ReactNode, useMemo } from 'react';

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
  type = ParagraphType.regular,
  size = ParagraphSize.base,
  style = ParagraphStyle.normal,
  className,
}) => {
  const classNameComplete = useMemo(
    () =>
      classNames(
        styles.paragraph,
        styles[type],
        styles[size],
        styles[style],
        className,
      ),
    [size, style, type, className],
  );

  return <p className={classNames(classNameComplete)}>{children}</p>;
};
