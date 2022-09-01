import React, {
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import classNames from 'classnames';
import { InputBase, InputBaseProps } from './InputBase';
import styles from './input.module.css';

export type InputProps = Omit<InputBaseProps, 'ref'> & {
  classNameInput?: string;
  invalid?: boolean;
  unit?: React.ReactNode;
  dataActionId?: string;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, classNameInput, type, invalid, unit, dataActionId, ...rest },
    ref,
  ) => {
    const inputRef = useRef<HTMLInputElement>(
      null,
    ) as React.MutableRefObject<HTMLInputElement>;

    useImperativeHandle(ref, () => inputRef.current);

    const onStepUp = useCallback(
      event => {
        inputRef.current?.stepUp();
        rest.onChangeText?.(inputRef.current?.value || '');
        rest.onChange?.(event);
      },
      [rest],
    );

    const onStepDown = useCallback(
      event => {
        inputRef.current?.stepDown();
        rest.onChangeText?.(inputRef.current?.value || '');
        rest.onChange?.(event);
      },
      [rest],
    );

    const wrapperClasses = useMemo(() => {
      return {
        'border-sov-white': rest.readOnly,
        'border-warning bg-warning': typeof invalid !== 'undefined' && invalid,
        'border-success bg-success': typeof invalid !== 'undefined' && !invalid,
      };
    }, [invalid, rest.readOnly]);

    return (
      <div className={classNames(styles.wrapper, wrapperClasses, className)}>
        <div className="relative flex-grow">
          <InputBase
            ref={inputRef}
            className={classNames(
              styles.input,
              { 'rounded-lg': !unit, 'rounded-l-lg': !!unit },
              classNameInput,
            )}
            type={type}
            {...rest}
            dataActionId={dataActionId}
          />
          {type === 'number' && rest.step ? (
            <>
              <button
                className={classNames(styles.stepButton, styles.up)}
                onClick={onStepUp}
              >
                <span />
              </button>
              <button
                className={classNames(styles.stepButton, styles.down)}
                onClick={onStepDown}
              >
                <span />
              </button>
            </>
          ) : null}
        </div>
        {unit && (
          <div
            className={classNames(
              'w-full h-8 max-w-24 px-3 flex items-center justify-center leading-none text-base font-semibold rounded-r-lg',
              {
                'bg-gray-9 text-gray-5': !rest.readOnly,
                'bg-transparent text-sov-white': rest.readOnly,
              },
            )}
          >
            <div>{unit}</div>
          </div>
        )}
      </div>
    );
  },
);
