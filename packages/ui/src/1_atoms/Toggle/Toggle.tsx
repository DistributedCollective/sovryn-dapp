import React, { forwardRef, ReactNode, useMemo } from 'react';

import classNames from 'classnames';

import { applyDataAttr } from '../../utils';
import styles from './Toggle.module.css';

export enum ToggleAlignment {
  LEFT = 'left',
  RIGHT = 'right',
}

type ToggleProps = {
  label?: ReactNode;
  alignment?: ToggleAlignment;
  onChange: () => void;
  checked: boolean;
  disabled?: boolean;
  dataAttribute?: string;
  className?: string;
  inline?: boolean;
};

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  (
    {
      label,
      alignment = ToggleAlignment.RIGHT,
      onChange,
      checked,
      disabled,
      dataAttribute,
      className,
      inline,
    },
    ref,
  ) => {
    const isRightAligned = useMemo(
      () => alignment === ToggleAlignment.RIGHT,
      [alignment],
    );

    return (
      <div
        className={classNames(className, {
          [styles.inlineBlock]: inline,
        })}
      >
        <label
          className={classNames(
            styles.label,
            { [styles.disabled]: disabled },
            { [styles.labelLeft]: isRightAligned },
          )}
        >
          <input
            ref={ref}
            type="checkbox"
            checked={checked}
            disabled={disabled}
            onChange={onChange}
            {...applyDataAttr(dataAttribute)}
          />
          <span
            className={classNames(styles.indicator, {
              [styles.inputRight]: isRightAligned,
            })}
          />
          {label}
        </label>
      </div>
    );
  },
);
