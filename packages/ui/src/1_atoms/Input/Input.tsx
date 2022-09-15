import React, { useImperativeHandle, useRef } from 'react';

import classNames from 'classnames';

import { InputBase, InputBaseProps } from '../InputBase/InputBase';
import styles from './Input.module.css';
import { InputSize } from './Input.types';

export type InputProps = Omit<InputBaseProps, 'ref'> & {
  classNameInput?: string;
  invalid?: boolean;
  dataActionId?: string;
  size?: InputSize;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      classNameInput,
      type,
      invalid,
      dataActionId,
      size = InputSize.small,
      ...rest
    },
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
              'h-10': size === InputSize.large,
              'h-8': size === InputSize.small,
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
