import React, { ReactNode, useCallback, useMemo, FC } from 'react';

import classNames from 'classnames';

import { applyDataAttr } from '../../utils';
import { HelperButton } from '../HelperButton/HelperButton';
import styles from './Datepicker.module.css';
import { formatValue } from './Datepicker.utils';

export enum DatepickerVariant {
  large = 'large',
  small = 'small',
}

export type DatepickerProps = {
  className?: string;
  dataAttribute?: string;
  label?: ReactNode;
  variant?: DatepickerVariant;
  tooltip?: ReactNode;
  value?: string | number;
  min?: string | number;
  max?: string | number;
  onChange: (number) => void;
  disabled?: boolean;
};

export const Datepicker: FC<DatepickerProps> = ({
  tooltip,
  variant = DatepickerVariant.large,
  label,
  dataAttribute,
  value,
  onChange,
  disabled,
  className,
  min,
  max,
}) => {
  const onChangeHandler = useCallback(
    e =>
      onChange(e.target.value ? new Date(e.target.value).getTime() / 1000 : ''),
    [onChange],
  );

  const formattedValue = useMemo(() => formatValue(value), [value]);
  const formattedMin = useMemo(() => formatValue(min), [min]);
  const formattedMax = useMemo(() => formatValue(max), [max]);

  return (
    <div className={classNames(styles.wrapper, className)}>
      <div
        className={classNames(styles.container, {
          [styles.large]: variant === DatepickerVariant.large,
          [styles.small]: variant === DatepickerVariant.small,
          [styles.disabled]: disabled,
        })}
      >
        {label && (
          <div className={styles.labelWrapper}>
            <div className={styles.label}>{label}</div>
            {tooltip && <HelperButton content={tooltip} />}
          </div>
        )}

        <input
          className={classNames(styles.input, {
            [styles.disabledInput]: disabled,
          })}
          type="date"
          {...applyDataAttr(dataAttribute)}
          onChange={onChangeHandler}
          value={formattedValue}
          min={formattedMin}
          max={formattedMax}
        />
      </div>
    </div>
  );
};
