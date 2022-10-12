import React, { FC, ReactNode } from 'react';

import classNames from 'classnames';

import styles from './Heading.module.css';
import { HeadingType } from './Heading.types';

export type HeadingProps = {
  children?: ReactNode;
  type?: HeadingType;
  className?: string;
};

export const Heading: FC<HeadingProps> = ({
  children,
  type = HeadingType.h1,
  className,
}) =>
  React.createElement(
    type,
    {
      className: classNames(styles.heading, styles[type], className),
    },
    children,
  );
