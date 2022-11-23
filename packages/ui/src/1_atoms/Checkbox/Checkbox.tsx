import React, {
  ChangeEvent,
  ChangeEventHandler,
  HTMLProps,
  ReactNode,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';

import classNames from 'classnames';

import { applyDataAttr } from '../../utils';
import { Icon } from '../Icon';
import { Paragraph } from '../Paragraph';
import styles from './Checkbox.module.css';

export type CheckboxProps = Omit<
  HTMLProps<HTMLInputElement>,
  'ref' | 'size'
> & {
  indeterminate?: boolean;
  dataLayoutId?: string;
  onChangeValue?: (value: boolean) => void;
  /** @deprecated Use onChangeText if possible */
  onChange?: ChangeEventHandler<HTMLInputElement>;
  label?: ReactNode;
  containerClassName?: string;
};

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      checked,
      dataLayoutId,
      onChange,
      onChangeValue,
      indeterminate,
      label,
      containerClassName,
      ...props
    },
    ref,
  ) => {
    const innerRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => innerRef.current!);

    const handleChange = useCallback(
      (event: ChangeEvent<HTMLInputElement>) => {
        onChangeValue?.(event.currentTarget.checked);
        onChange?.(event);
      },
      [onChange, onChangeValue],
    );

    useEffect(() => {
      if (innerRef && innerRef.current) {
        innerRef.current.indeterminate = !!indeterminate;
      }
    }, [indeterminate]);

    return (
      <label className={classNames(styles.container, containerClassName)}>
        <input
          {...props}
          {...applyDataAttr(dataLayoutId)}
          ref={innerRef}
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          className={styles.input}
        />
        <div
          className={classNames(
            styles.checkbox,
            {
              [styles.checked]: checked,
              [styles.indeterminate]: indeterminate,
              [styles.disabled]: props.disabled,
            },
            props.className,
          )}
        >
          <div>
            {checked && !indeterminate && <Icon icon="check" size={14} />}
            {indeterminate && <Icon icon="x-mark" size={10} />}
          </div>
        </div>
        {label && <Paragraph>{label}</Paragraph>}
      </label>
    );
  },
);
