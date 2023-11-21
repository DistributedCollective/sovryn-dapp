import React, { FC, ReactNode } from 'react';

import classNames from 'classnames';

import { Tooltip } from '../Tooltip';
import styles from './ContextLink.module.css';

export type ContextLinkProps = {
  /**
   * The content of the context link.
   **/
  children: ReactNode;
  tooltipContent: ReactNode;
  className?: string;
  dataAttribute?: string;
};

export const ContextLink: FC<ContextLinkProps> = ({
  children,
  tooltipContent,
  className,
  dataAttribute,
}) => (
  <Tooltip
    content={tooltipContent}
    className={classNames(styles.link, className)}
    tooltipClassName={styles.tooltip}
    dataAttribute={dataAttribute}
  >
    <div>{children}</div>
  </Tooltip>
);
