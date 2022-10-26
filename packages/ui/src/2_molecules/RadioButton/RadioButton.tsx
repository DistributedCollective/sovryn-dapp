import React, { forwardRef, LegacyRef } from 'react';

import classNames from 'classnames';

import styles from './RadioButton.module.css';
import { IRadioButtonProps } from './RadioButton.types';

export const RadioButton = forwardRef<HTMLInputElement, IRadioButtonProps>(
  (
    { id, label, disabled, className, dataLayoutId, labelInfo, ...rest },
    ref,
  ) => (
    <div
      className={classNames(styles.radioButton, disabled && styles.disabled)}
    >
      <label htmlFor={id} className={classNames(styles.label, className)}>
        <input
          id={id}
          type="radio"
          disabled={disabled}
          data-layout-id={dataLayoutId}
          ref={ref as LegacyRef<HTMLInputElement>}
          {...rest}
        />
        {label}
      </label>
      {labelInfo}
    </div>
  ),
);
