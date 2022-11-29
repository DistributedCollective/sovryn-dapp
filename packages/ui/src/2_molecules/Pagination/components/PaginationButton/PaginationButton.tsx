import React, { FC, MouseEventHandler } from 'react';

import { Icon, IconType } from '../../../../1_atoms';
import { applyDataAttr } from '../../../../utils';
import styles from './PaginationButton.module.css';

type PaginationButtonProps = {
  dataLayoutId?: string;
  disabled: boolean;
  onClick?: MouseEventHandler;
  icon: IconType;
  iconClassName?: string;
};

export const PaginationButton: FC<PaginationButtonProps> = ({
  disabled,
  onClick,
  icon,
  iconClassName,
  dataLayoutId,
}) => (
  <button
    className={styles.button}
    type="button"
    disabled={disabled}
    onClick={onClick}
    {...applyDataAttr(dataLayoutId)}
  >
    <Icon className={iconClassName} icon={icon} size={12} />
  </button>
);
