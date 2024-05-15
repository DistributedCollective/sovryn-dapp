import React, {
  ReactNode,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import classNames from 'classnames';

import { InputProps } from '../../1_atoms';
import { InputBase } from '../../1_atoms/InputBase/InputBase';
import { HelperButton } from '../HelperButton/HelperButton';
import styles from './AmountInput.module.css';

const MAX_DECIMALS = 18;
const MAX_VALUE = Number.MAX_VALUE;

export enum AmountInputVariant {
  large = 'large',
  small = 'small',
}

export type AmountInputProps = Omit<
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
      decimalPrecision = MAX_DECIMALS,
      unit,
      maxAmount,
      label,
      invalid,
      dataAttribute,
      value,
      onChangeText,
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
          return '';
        }

        let unformattedNumberValue = String(value);

        if (
          useAmountButtons &&
          maxAmount &&
          Number(unformattedNumberValue) > Number(maxAmount)
        ) {
          unformattedNumberValue = String(maxAmount);
        }

        if (Number(unformattedNumberValue) >= MAX_VALUE) {
          unformattedNumberValue = String(MAX_VALUE);
        }

        if (rest?.min && Number(unformattedNumberValue) < Number(rest.min)) {
          unformattedNumberValue = String(rest.min);
        }

        const [integerPart] = unformattedNumberValue.split('.');

        const decimals = Math.min(decimalPrecision, MAX_DECIMALS);

        const startingIndex =
          integerPart.length > 1 && integerPart.startsWith('0') ? 1 : 0;

        return String(unformattedNumberValue).slice(
          startingIndex,
          integerPart.length + decimals + 1,
        );
      },
      [decimalPrecision, maxAmount, rest.min, useAmountButtons],
    );

    const [formattedValue, setFormattedValue] = useState(
      formatValue(value as string),
    );

    const onChangeTextHandler = useCallback(
      (value: string) => {
        const formattedValue = formatValue(value);

        onChangeText?.(formattedValue);
        setFormattedValue(formattedValue);
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
        onChangeTextHandler(event.target.value);
        onBlur?.(event);
        setFocused(false);
      },
      [onBlur, onChangeTextHandler],
    );

    // updating value if it was changed by parent component
    useEffect(() => {
      setFormattedValue(formatValue(value as string));
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

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
            dataAttribute={dataAttribute}
            onFocus={onFocus}
            onBlur={onBlurHandler}
            value={formattedValue}
            onChangeText={onChangeTextHandler}
            {...rest}
          />

          {unit && <div>{unit}</div>}
        </div>
      </div>
    );
  },
);
