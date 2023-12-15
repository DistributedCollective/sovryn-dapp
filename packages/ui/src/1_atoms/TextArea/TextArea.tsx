import React, { useImperativeHandle, useRef } from 'react';

import classNames from 'classnames';

import styles from './TextArea.module.css';
import { TextAreaBase, TextAreaBaseProps } from '../TextAreaBase/TextAreaBase';
import { TextAreaSize } from './TextArea.types';

export type TextAreaProps = Omit<TextAreaBaseProps, 'ref' | 'size'> & {
  classNameInput?: string;
  invalid?: boolean;
  size?: TextAreaSize;
};

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      className,
      classNameInput,
      type,
      invalid,
      size = TextAreaSize.small,
      ...rest
    },
    ref,
  ) => {
    const inputRef = useRef<HTMLTextAreaElement>(
      null,
    ) as React.MutableRefObject<HTMLTextAreaElement>;

    useImperativeHandle(ref, () => inputRef.current);

    return (
      <div className={classNames(styles.wrapper, className)}>
        <div className={styles.container}>
          <TextAreaBase
            ref={inputRef}
            className={classNames(styles.input, classNameInput, {
              [styles.invalid]: invalid,
              [styles.large]: size === TextAreaSize.large,
              [styles.small]: size === TextAreaSize.small,
            })}
            {...rest}
          />
        </div>
      </div>
    );
  },
);
