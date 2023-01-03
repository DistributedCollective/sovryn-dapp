import React, { FC } from 'react';

import { applyDataAttr } from '../../../utils';
import { VerticalTabMobileItemButtonProps } from '../VerticalTabsMobile.types';
import styles from './VerticalTabMobileItem.module.css';

export const VerticalTabMobileItem: FC<VerticalTabMobileItemButtonProps> = ({
  disabled,
  label,
  infoText,
  dataAttribute,
  onClick,
}) => (
  <button
    className={styles.button}
    disabled={disabled}
    {...applyDataAttr(dataAttribute)}
    onClick={onClick}
  >
    <p className={styles.label}>{label}</p>
    {infoText && <small className={styles.info}>{infoText}</small>}
  </button>
);
