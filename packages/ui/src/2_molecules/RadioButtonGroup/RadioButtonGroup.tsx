import React, { FC } from 'react';

import { RadioButton } from '../RadioButton';
import styles from './RadioButtonGroup.module.css';
import {
  RadioButtonOption,
  RadioButtonGroupProps,
} from './RadioButtonGroup.types';

export const RadioButtonGroup: FC<RadioButtonGroupProps> = ({
  label,
  options,
  onChange,
}) => (
  <fieldset className={styles.radioButtonGroup}>
    <legend>{label}</legend>
    {options.map(
      ({ label, name, disabled, labelInfo }: RadioButtonOption, index) => {
        const id = `radio-option-${label}`;
        return (
          <RadioButton
            id={id}
            key={id}
            label={label}
            value={label}
            name={name}
            disabled={disabled}
            defaultChecked={index === 0}
            onChange={onChange}
            labelInfo={labelInfo}
          />
        );
      },
    )}
  </fieldset>
);
