import React, { FC } from 'react';

import classNames from 'classnames';

import { Heading, HeadingType } from '../../1_atoms';
import { applyDataAttr } from '../../utils';
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
  dataAttribute,
  defaultChecked = 0,
  className,
}) => (
  <fieldset
    className={classNames(styles.radioButtonGroup, className)}
    {...applyDataAttr(dataAttribute)}
  >
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
          helper,
        }: RadioButtonOption,
        index,
      ) => {
        const id = `radio-option-${name}-${label}`;
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
            helper={helper}
          />
        );
      },
    )}
  </fieldset>
);
