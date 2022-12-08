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

const DEFAULT_DECIMAL_PRECISION = 18;
const MAX_VALUE = 999999999;

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
          return '0';
        }
        const { language } = navigator;

        let unformattedNumberValue = Number(value);

        if (maxAmount && unformattedNumberValue > maxAmount) {
          unformattedNumberValue = maxAmount;
        }

        if (unformattedNumberValue >= MAX_VALUE + 1) {
          unformattedNumberValue = MAX_VALUE;
        }

        return unformattedNumberValue
          .toLocaleString(language, {
            maximumFractionDigits: decimalPrecision,
            useGrouping: false,
          })
          .replace(',', '.');
      },
      [decimalPrecision, maxAmount],
    );

    const [formattedValue, setFormattedValue] = useState(
      formatValue(value as string),
    );

    const onChangeTextHandler = useCallback(
      (value: string) => {
        setFormattedValue(formatValue(value));
        onChangeText?.(formattedValue);
      },
      [formatValue, formattedValue, onChangeText],
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
            dataLayoutId={dataLayoutId}
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
