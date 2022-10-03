import React, { FC, PropsWithChildren, ReactNode } from 'react';

import classNames from 'classnames';

import styles from './Link.module.css';
import { LinkStyle } from './Link.types';

export type LinkProps = {
  text: ReactNode;
  href: string;
  openNewTab?: boolean;
  className?: string;
  style?: LinkStyle;
  dataActionId?: string;
};

export const Link: FC<PropsWithChildren<LinkProps>> = ({
  text,
  href,
  openNewTab = true,
  className,
  style = LinkStyle.primary,
  dataActionId,
}) => {
  return (
    <a
      rel="noopener noreferrer"
      href={href}
      target={openNewTab ? 'blank' : undefined}
      className={classNames(className, styles.link, styles[style])}
      data-action-id={dataActionId}
    >
      {text}
    </a>
  );
};
