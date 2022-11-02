import React, { FC } from 'react';

import { Heading, HeadingType } from '../../1_atoms';
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
  dataLayoutId,
  defaultChecked = 0,
}) => (
  <fieldset className={styles.radioButtonGroup} data-layout-id={dataLayoutId}>
    {label && (
      <Heading type={HeadingType.h3} className={styles.headingLabel}>
        {label}
      </Heading>
    )}
    {options.map(
      (
        {
          label,
          value,
          name,
          disabled,
          labelInfo,
          contentToShow,
        }: RadioButtonOption,
        index,
      ) => {
        const id = `radio-option-${label}`;
        return (
          <RadioButton
            id={id}
            key={id}
            label={label}
            value={value}
            name={name}
            disabled={disabled}
            defaultChecked={index === defaultChecked}
            onChange={onChange}
            labelInfo={labelInfo}
            contentToShow={contentToShow}
          />
        );
      },
    )}
  </fieldset>
);
