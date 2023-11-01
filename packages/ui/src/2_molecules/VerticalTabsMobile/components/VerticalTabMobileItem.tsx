import React, { FC } from 'react';

import classNames from 'classnames';

import { applyDataAttr } from '../../../utils';
import { VerticalTabMobileItemButtonProps } from '../VerticalTabsMobile.types';
import styles from './VerticalTabMobileItem.module.css';

export const VerticalTabMobileItem: FC<VerticalTabMobileItemButtonProps> = ({
  disabled,
  label,
  infoText,
  dataAttribute,
  onClick,
  className,
}) => (
  <button
    className={classNames(styles.button, className)}
    disabled={disabled}
    {...applyDataAttr(dataAttribute)}
    onClick={onClick}
  >
    <p className={styles.label}>{label}</p>
    {infoText && <small className={styles.info}>{infoText}</small>}
  </button>
);
