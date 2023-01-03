import React, { ReactNode } from 'react';

import classNames from 'classnames';

import { Icon } from '../../1_atoms';
import { Tooltip } from '../Tooltip';
import styles from './HelperButton.module.css';

type HelperButtonProps = {
  content: ReactNode;
  className?: string;
  dataAttribute?: string;
};

export const HelperButton: React.FC<HelperButtonProps> = ({
  content,
  className,
  dataAttribute,
}) => (
  <Tooltip
    content={content}
    className={classNames(styles.wrapper, className)}
    dataAttribute={dataAttribute}
  >
    <div>
      <Icon size={12} icon="info" />
    </div>
  </Tooltip>
);
