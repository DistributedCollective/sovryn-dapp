import React, {
  MouseEventHandler,
  ReactNode,
  useMemo,
  forwardRef,
  LegacyRef,
} from 'react';

import classNames from 'classnames';
import { Link } from 'react-router-dom';

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
  loading?: boolean;
  className?: string;
  dataLayoutId?: string;
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
      loading,
      className,
      dataLayoutId,
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
          disabled && styles.disabled,
          className,
        ),
      [loading, size, style, type, disabled, className],
    );

    const onClickHandler = useMemo(
      () => (!disabled && !loading ? onClick : undefined),
      [disabled, loading, onClick],
    );

    if (href) {
      if (hrefExternal) {
        return (
          <a
            ref={ref as LegacyRef<HTMLAnchorElement>}
            className={classNamesComplete}
            href={href}
            target="_blank"
            rel="noreferrer"
            onClick={onClickHandler}
            data-layout-id={dataLayoutId}
          >
            {text}
          </a>
        );
      } else {
        return (
          <Link
            ref={ref as React.Ref<HTMLAnchorElement>}
            to={href}
            className={classNamesComplete}
            onClick={onClickHandler}
            data-layout-id={dataLayoutId}
          >
            {text}
          </Link>
        );
      }
    } else {
      return (
        <button
          ref={ref as LegacyRef<HTMLButtonElement>}
          type={type}
          disabled={disabled}
          className={classNamesComplete}
          onClick={onClickHandler}
          data-layout-id={dataLayoutId}
        >
          {text}
        </button>
      );
    }
  },
);
