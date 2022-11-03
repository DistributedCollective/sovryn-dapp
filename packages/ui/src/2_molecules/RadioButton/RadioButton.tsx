import React, { forwardRef, LegacyRef } from 'react';

import classNames from 'classnames';

import { applyDataAttr } from '../../utils';
import { HelperButton } from '../HelperButton';
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
      helper,
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
            {...applyDataAttr(dataLayoutId)}
            ref={ref as LegacyRef<HTMLInputElement>}
            name={name}
            {...rest}
          />
          {label}

          {helper && <HelperButton className="ml-1.5" content={helper} />}
        </label>
        <div>{labelInfo}</div>
      </div>
      {contentToShow}
    </>
  ),
);
