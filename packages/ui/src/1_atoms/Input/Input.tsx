import React, { useImperativeHandle, useMemo, useRef } from 'react';

import classNames from 'classnames';

import styles from './Input.module.css';
import { InputBase, InputBaseProps } from './InputBase';

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

    const wrapperClasses = useMemo(() => {
      return {
        'border-error-light': typeof invalid !== 'undefined' && invalid,
      };
    }, [invalid]);

    return (
      <div className={classNames(styles.wrapper, wrapperClasses, className)}>
        <div className="relative flex-grow">
          <InputBase
            ref={inputRef}
            className={classNames(
              styles.input,
              // { 'rounded-lg': !unit, 'rounded-l-lg': !!unit },
              classNameInput,
            )}
            type={type}
            {...rest}
            dataActionId={dataActionId}
          />
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
