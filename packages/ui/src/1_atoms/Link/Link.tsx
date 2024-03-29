import React, { FC, ReactNode } from 'react';

import classNames from 'classnames';

import { LinkBase } from '../LinkBase/LinkBase';
import styles from './Link.module.css';
import { LinkStyle } from './Link.types';

export type LinkProps = {
  text: ReactNode;
  href: string;
  openNewTab?: boolean;
  className?: string;
  style?: LinkStyle;
  dataAttribute?: string;
};

export const Link: FC<LinkProps> = ({
  text,
  href,
  openNewTab = true,
  className,
  style = LinkStyle.primary,
  dataAttribute,
}) => (
  <LinkBase
    href={href}
    openNewTab={openNewTab}
    className={classNames(styles.link, styles[style], className)}
    dataAttribute={dataAttribute}
  >
    {text}
  </LinkBase>
);
