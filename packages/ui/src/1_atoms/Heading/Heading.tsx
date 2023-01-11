import React, { FC, ReactNode } from 'react';

import classNames from 'classnames';

import { DATA_ATTRIBUTE } from '../../utils/constants';
import styles from './Heading.module.css';
import { HeadingType } from './Heading.types';

export type HeadingProps = {
  children?: ReactNode;
  type?: HeadingType;
  className?: string;
  dataAttribute?: string;
};

export const Heading: FC<HeadingProps> = ({
  children,
  type = HeadingType.h1,
  className,
  dataAttribute,
}) =>
  React.createElement(
    type,
    {
      className: classNames(styles[type], className),
      [DATA_ATTRIBUTE]: dataAttribute,
    },
    children,
  );
