import React, {
  MouseEventHandler,
  ReactNode,
  useMemo,
  forwardRef,
  LegacyRef,
} from 'react';

import classNames from 'classnames';

import { applyDataAttr } from '../../utils';
import styles from './Button.module.css';
import { ButtonType, ButtonSize, ButtonStyle } from './Button.types';

export interface IButtonProps {
  text: ReactNode;
  href?: string;
  hrefExternal?: boolean;
  onClick?: MouseEventHandler;
  type?: ButtonType;
  size?: ButtonSize;
  style?: ButtonStyle;
  disabled?: boolean;
  disabledStyle?: boolean;
  loading?: boolean;
  className?: string;
  dataAttribute?: string;
}

export const Button = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  IButtonProps
>(
  (
    {
      text,
      href,
      hrefExternal,
      onClick,
      size = ButtonSize.small,
      style = ButtonStyle.primary,
      type = ButtonType.button,
      disabled,
      disabledStyle,
      loading,
      className,
      dataAttribute,
    },
    ref,
  ) => {
    const classNamesComplete = useMemo(
      () =>
        classNames(
          styles.button,
          loading && styles.loading,
          styles[size],
          styles[style],
          styles[type],
          (disabled || disabledStyle) && styles.disabled,
          className,
        ),
      [loading, size, style, type, disabled, disabledStyle, className],
    );

    const onClickHandler = useMemo(
      () => (!disabled && !loading ? onClick : undefined),
      [disabled, loading, onClick],
    );

    if (href) {
      return (
        <a
          ref={ref as LegacyRef<HTMLAnchorElement>}
          className={classNamesComplete}
          href={href}
          target={hrefExternal ? '_blank' : undefined}
          rel="noopener noreferrer"
          onClick={onClickHandler}
          {...applyDataAttr(dataAttribute)}
        >
          {text}
        </a>
      );
    } else {
      return (
        <button
          ref={ref as LegacyRef<HTMLButtonElement>}
          type={type}
          disabled={disabled}
          className={classNamesComplete}
          onClick={onClickHandler}
          {...applyDataAttr(dataAttribute)}
        >
          {text}
        </button>
      );
    }
  },
);
