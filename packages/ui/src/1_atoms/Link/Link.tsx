import React, { FC, PropsWithChildren, ReactNode } from 'react';

import classNames from 'classnames';

import { DATA_ATTRIBUTE } from '../../types';
import styles from './Link.module.css';
import { LinkStyle } from './Link.types';

export type LinkProps = {
  text: ReactNode;
  href: string;
  openNewTab?: boolean;
  className?: string;
  style?: LinkStyle;
  dataLayoutId?: string;
};

export const Link: FC<PropsWithChildren<LinkProps>> = ({
  text,
  href,
  openNewTab = true,
  className,
  style = LinkStyle.primary,
  dataLayoutId,
}) => {
  return (
    <a
      rel="noopener noreferrer"
      href={href}
      target={openNewTab ? 'blank' : undefined}
      className={classNames(styles.link, styles[style], className)}
      {...{ [DATA_ATTRIBUTE]: dataLayoutId }}
    >
      {text}
    </a>
  );
};
