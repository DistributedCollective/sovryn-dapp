import React, { useImperativeHandle, useRef } from 'react';

import classNames from 'classnames';

import styles from './Input.module.css';
import { InputBase, InputBaseProps } from './InputBase';

export type InputProps = Omit<InputBaseProps, 'ref'> & {
  classNameInput?: string;
  invalid?: boolean;
  dataActionId?: string;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, classNameInput, type, invalid, dataActionId, ...rest },
    ref,
  ) => {
    const inputRef = useRef<HTMLInputElement>(
      null,
    ) as React.MutableRefObject<HTMLInputElement>;

    useImperativeHandle(ref, () => inputRef.current);

    return (
      <div className={classNames(styles.wrapper, className)}>
        <div className="relative flex-grow">
          <InputBase
            ref={inputRef}
            className={classNames(styles.input, classNameInput, {
              [styles.invalid]: invalid,
            })}
            type={type}
            {...rest}
            dataActionId={dataActionId}
          />
        </div>
      </div>
    );
  },
);
