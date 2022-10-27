import React, {
  ReactNode,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import classNames from 'classnames';

import { InputProps } from '../../1_atoms';
import { InputBase } from '../../1_atoms/InputBase/InputBase';
import { HelperButton } from '../HelperButton/HelperButton';
import styles from './AmountInput.module.css';

const DEFAULT_DECIMAL_PRECISION = 6;

export enum AmountInputVariant {
  large = 'large',
  small = 'small',
}

type AmountInputProps = Omit<
  InputProps,
  'classNameInput' | 'type' | 'size' | 'value'
> & {
  label?: ReactNode;
  variant?: AmountInputVariant;
  tooltip?: ReactNode;
  useAmountButtons?: boolean;
  decimalPrecision?: number;
  unit?: ReactNode;
  maxAmount?: number;
  value?: string | number;
};

export const AmountInput = React.forwardRef<HTMLInputElement, AmountInputProps>(
  (
    {
      className,
      tooltip,
      variant = AmountInputVariant.large,
      useAmountButtons = false,
      decimalPrecision = DEFAULT_DECIMAL_PRECISION,
      unit,
      maxAmount,
      label,
      invalid,
      dataLayoutId,
      value,
      onChangeText,
      onChange,
      onBlur,
      ...rest
    },
    ref,
  ) => {
    const inputRef = useRef<HTMLInputElement>(
      null,
    ) as React.MutableRefObject<HTMLInputElement>;

    useImperativeHandle(ref, () => inputRef.current);

    const formatValue = useCallback(
      (value: string | number) => {
        if (!value) {
          return 0;
        }
        if (!decimalPrecision) {
          return value;
        }

        const decimalLength = value.toString().split(/[,.]/)[1]?.length || 0;
        if (decimalLength <= decimalPrecision) {
          return value;
        }

        const unformattedValue =
          typeof value === 'string' ? Number(value) : value;

        return unformattedValue
          .toLocaleString(navigator.language, {
            minimumFractionDigits: decimalPrecision,
            maximumFractionDigits: decimalPrecision,
          })
          .replace(',', '.');
      },
      [decimalPrecision],
    );

    const onChangeTextHandler = useCallback(
      (value: string) => {
        onChangeText?.(String(formatValue(value)));
      },
      [formatValue, onChangeText],
    );

    const [focused, setFocused] = useState(false);
    const onFocus = useCallback(() => setFocused(true), []);

    const onBlurHandler = useCallback(
      (
        event: React.FocusEvent<HTMLInputElement> &
          React.ChangeEvent<HTMLInputElement>,
      ) => {
        onBlur?.(event);
        setFocused(false);
        onChangeTextHandler(event.target.value);
      },
      [onBlur, onChangeTextHandler],
    );

    const onChangeHandler = useCallback(
      (event: React.FormEvent<HTMLInputElement>) => {
        event.preventDefault();
        event.stopPropagation();
      },
      [],
    );

    return (
      <div className={classNames(styles.wrapper, className)}>
        <div
          className={classNames(styles.container, {
            [styles.large]: variant === AmountInputVariant.large,
            [styles.small]: variant === AmountInputVariant.small,
            [styles.invalid]: invalid,
            [styles.focus]: focused,
            [styles.disabled]: rest.disabled,
            [styles.readOnly]: rest.readOnly,
          })}
        >
          {label && (
            <div className={styles.labelWrapper}>
              <div className={styles.label}>{label}</div>
              {tooltip && <HelperButton content={tooltip} />}
            </div>
          )}

          <InputBase
            ref={inputRef}
            lang={navigator.language}
            className={classNames(styles.input, {
              [styles.disabledInput]: rest.disabled,
            })}
            type="number"
            dataLayoutId={dataLayoutId}
            onFocus={onFocus}
            onBlur={onBlurHandler}
            value={formatValue(value || 0)}
            onChange={onChangeHandler}
            onChangeText={onChangeTextHandler}
            {...rest}
          />

          {unit && <div>{unit}</div>}
        </div>
      </div>
    );
  },
);
