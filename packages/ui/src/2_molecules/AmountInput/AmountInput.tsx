import React, {
  ReactNode,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import classNames from 'classnames';

import { Icon, InputProps, InputSize } from '../../1_atoms';
import { InputBase } from '../../1_atoms/InputBase/InputBase';
import { Tooltip } from '../Tooltip';
import styles from './AmountInput.module.css';

export enum AmountInputVariant {
  large = 'large',
  small = 'small',
}

type AmountInputProps = InputProps & {
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
      size = InputSize.small,
      dataLayoutId,
      type,
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
            {tooltip && (
              <Tooltip
                content={tooltip}
                children={
                  <div>
                    <Icon size={10} icon="info" />
                  </div>
                }
              />
            )}
          </div>
          <InputBase
            ref={inputRef}
            className={classNames(styles.input, classNameInput, {
              [styles.disabled]: rest.disabled,
            })}
            type="number"
            {...rest}
            dataLayoutId={dataLayoutId}
            lang={navigator.language}
            onFocus={onFocus}
            onBlur={onBlur}
          />
          {unit && <div>{unit}</div>}
        </div>
      </div>
    );
  },
);
