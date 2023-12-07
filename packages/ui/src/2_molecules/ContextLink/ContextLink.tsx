import React, { FC, ReactNode } from 'react';

import classNames from 'classnames';

import { Tooltip, TooltipTrigger } from '../Tooltip';
import styles from './ContextLink.module.css';

export type ContextLinkProps = {
  /**
   * The content of the context link.
   **/
  children: ReactNode;
  tooltipContent: ReactNode;
  className?: string;
  dataAttribute?: string;
  trigger?: TooltipTrigger;
};

export const ContextLink: FC<ContextLinkProps> = ({
  children,
  tooltipContent,
  className,
  dataAttribute,
  trigger = TooltipTrigger.click,
}) => (
  <Tooltip
    content={tooltipContent}
    className={classNames(styles.link, className)}
    tooltipClassName={styles.tooltip}
    dataAttribute={dataAttribute}
    trigger={trigger}
  >
    <div>{children}</div>
  </Tooltip>
);
