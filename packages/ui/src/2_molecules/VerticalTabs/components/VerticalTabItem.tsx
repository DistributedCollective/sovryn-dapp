import React, { FC } from 'react';

import classNames from 'classnames';

import { VerticalTabsItemButtonProps } from '../VerticalTabs.types';
import styles from './VerticalTabItem.module.css';

export const VerticalTabItem: FC<VerticalTabsItemButtonProps> = ({
  disabled,
  label,
  infoText,
  active,
  dataLayoutId,
  onClick,
}) => {
  return (
    <button
      className={classNames(styles.button, { [styles.active]: active })}
      disabled={disabled}
      data-layout-id={dataLayoutId}
      data-active={active}
      onClick={onClick}
    >
      <p className={styles.label}>{label}</p>
      {infoText && <small className={styles.info}>{infoText}</small>}
    </button>
  );
};
