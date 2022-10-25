import React, { ReactNode } from 'react';

import classNames from 'classnames';

import { Icon } from '../../1_atoms';
import { Tooltip } from '../Tooltip';
import styles from './HelperButton.module.css';

const iconSize = 8.33;

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
    dataLayoutId={dataAttribute}
  >
    <div>
      <Icon size={iconSize} icon="info" />
    </div>
  </Tooltip>
);
