import React, { forwardRef, LegacyRef } from 'react';

import classNames from 'classnames';

import styles from './RadioButton.module.css';
import { IRadioButtonProps } from './RadioButton.types';

export const RadioButton = forwardRef<HTMLInputElement, IRadioButtonProps>(
  (
    {
      id,
      label,
      disabled,
      name,
      className,
      dataLayoutId,
      labelInfo,
      contentToShow,
      ...rest
    },
    ref,
  ) => (
    <>
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
            name={name}
            {...rest}
          />
          {label}
        </label>
        <div>{labelInfo}</div>
      </div>
      {contentToShow}
    </>
  ),
);
