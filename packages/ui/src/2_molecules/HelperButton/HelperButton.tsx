import React, { ReactNode } from 'react';

import classNames from 'classnames';

import { Icon } from '../../1_atoms';
import { Tooltip, TooltipPlacement, TooltipTrigger } from '../Tooltip';
import styles from './HelperButton.module.css';

type HelperButtonProps = {
  content: ReactNode;
  className?: string;
  tooltipClassName?: string;
  dataAttribute?: string;
  trigger?: TooltipTrigger;
  placement?: TooltipPlacement;
};

export const HelperButton: React.FC<HelperButtonProps> = ({
  content,
  className,
  tooltipClassName,
  dataAttribute,
  trigger,
  placement,
}) => (
  <Tooltip
    content={content}
    className={classNames(styles.wrapper, className)}
    dataAttribute={dataAttribute}
    trigger={trigger}
    placement={placement}
    tooltipClassName={tooltipClassName}
  >
    <div>
      <Icon size={12} icon="info" />
    </div>
  </Tooltip>
);
