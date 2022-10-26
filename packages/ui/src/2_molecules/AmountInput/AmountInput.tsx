import React, {
  ReactNode,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';

import classNames from 'classnames';

import { InputProps } from '../../1_atoms';
import { InputBase } from '../../1_atoms/InputBase/InputBase';
import { HelperButton } from '../HelperButton/HelperButton';
import styles from './AmountInput.module.css';

export enum AmountInputVariant {
  large = 'large',
  small = 'small',
}

type AmountInputProps = Omit<InputProps, 'size'> & {
  label?: ReactNode;
  tooltip?: ReactNode;
  variant?: AmountInputVariant;
  useAmountButtons?: boolean;
  numDecimals?: number;
  unit?: ReactNode;
  maxAmount?: ReactNode;
};

export const AmountInput = React.forwardRef<HTMLInputElement, AmountInputProps>(
  (
    {
      className,
      classNameInput,
      tooltip,
      variant = AmountInputVariant.small,
      useAmountButtons,
      numDecimals,
      unit,
      maxAmount,
      label,
      invalid,
      dataLayoutId,
      type,
      value,
      ...rest
    },
    ref,
  ) => {
    const inputRef = useRef<HTMLInputElement>(
      null,
    ) as React.MutableRefObject<HTMLInputElement>;

    useImperativeHandle(ref, () => inputRef.current);

    const [focused, setFocused] = useState(false);
    const onFocus = useCallback(() => setFocused(prevValue => !prevValue), []);
    const onBlur = useCallback(() => setFocused(false), []);

    const formattedValue = useMemo(() => {
      if (!value) {
        return 0;
      }
      if (!numDecimals) {
        return value;
      }

      const decimalLength = value.toString().split(/[,.]/)[1]?.length || 0;
      if (decimalLength <= numDecimals) {
        return value;
      }

      const unformattedValue =
        typeof value === 'string' ? Number(value) : value;

      return unformattedValue
        .toLocaleString(navigator.language, {
          minimumFractionDigits: numDecimals,
          maximumFractionDigits: numDecimals,
        })
        .replace(',', '.');
    }, [numDecimals, value]);

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
          <div className={styles.labelWrapper}>
            <div className={styles.label}>{label}</div>
            {tooltip && <HelperButton content={tooltip} />}
          </div>
          <InputBase
            ref={inputRef}
            lang={navigator.language}
            className={classNames(styles.input, classNameInput, {
              [styles.disabled]: rest.disabled,
            })}
            type="number"
            dataLayoutId={dataLayoutId}
            onFocus={onFocus}
            onBlur={onBlur}
            value={formattedValue}
            {...rest}
          />
          {unit && <div>{unit}</div>}
        </div>
      </div>
    );
  },
);
