import { MouseEventHandler, useMemo, ReactNode } from 'react';

import classNames from 'classnames';
import { Link } from 'react-router-dom';

import styles from './Button.module.css';
import {
  ButtonType,
  ButtonColor,
  ButtonSize,
  ButtonStyle,
} from './Button.types';

export interface IButtonProps {
  text: ReactNode;
  href?: string;
  hrefExternal?: boolean;
  onClick?: MouseEventHandler;
  type?: ButtonType;
  color?: ButtonColor;
  size?: ButtonSize;
  style?: ButtonStyle;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  dataActionId?: string;
}

export const Button: React.FC<IButtonProps> = ({
  text,
  href,
  hrefExternal,
  onClick,
  color = ButtonColor.primary,
  size = ButtonSize.md,
  style = ButtonStyle.normal,
  type = ButtonType.button,
  loading,
  disabled,
  className,
  dataActionId,
}) => {
  const classNameComplete = useMemo(
    () =>
      classNames(
        styles.button,
        loading && styles.loading,
        color && styles[color],
        size && styles[size],
        style && styles[style],
        disabled && styles.disabled,
        className,
      ),
    [loading, color, size, style, disabled, className],
  );

  const onClickHandler = useMemo(
    () => (!disabled && !loading ? onClick : undefined),
    [disabled, loading, onClick],
  );

  if (href) {
    if (hrefExternal) {
      return (
        <a
          className={classNameComplete}
          href={href}
          target="_blank"
          rel="noreferrer"
          onClick={onClickHandler}
          data-action-id={dataActionId}
        >
          {text}
        </a>
      );
    } else {
      return (
        <Link
          to={href}
          className={classNameComplete}
          onClick={onClickHandler}
          data-action-id={dataActionId}
        >
          {text}
        </Link>
      );
    }
  } else {
    return (
      <button
        type={type}
        disabled={disabled}
        className={classNameComplete}
        onClick={onClickHandler}
        data-action-id={dataActionId}
      >
        {text}
      </button>
    );
  }
};
