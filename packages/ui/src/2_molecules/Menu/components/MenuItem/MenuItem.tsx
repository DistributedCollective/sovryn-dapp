import React, {
  ReactNode,
  MouseEventHandler,
  useMemo,
  useCallback,
} from 'react';

import classNames from 'classnames';
import { Link, useLocation } from 'react-router-dom';

import { Icon, IconProps } from '../../../../1_atoms';
import { IconType } from '../../../../1_atoms/Icon/Icon.types';
import styles from './MenuItem.module.css';

type MenuItemProps = {
  className?: string;
  icon?: IconType;
  iconProps?: Omit<IconProps, 'icon'>;
  text: ReactNode;
  label?: ReactNode;
  disabled?: boolean;
  href?: string;
  hrefExternal?: boolean;
  onClick?: MouseEventHandler;
  dataActionId?: string;
};

export const MenuItem: React.FC<MenuItemProps> = ({
  className,
  icon,
  text,
  label,
  disabled,
  href,
  hrefExternal,
  onClick,
  dataActionId,
  iconProps,
}) => {
  const onClickHandler = useCallback(
    event => {
      if (disabled) {
        event.preventDefault();
        event.stopPropagation();
      } else {
        onClick?.(event);
      }
    },
    [onClick, disabled],
  );

  const location = useLocation();

  const isActive = useMemo(
    () => href && href === location.pathname,
    [href, location.pathname],
  );

  const button = useMemo(() => {
    if (href) {
      if (hrefExternal) {
        return (
          <a
            className={classNames(styles.button, {
              [styles.disabled]: disabled,
            })}
            href={href}
            target="_blank"
            rel="noreferrer"
            onClick={onClickHandler}
            data-action-id={dataActionId}
          >
            <div className={styles.hostBlock}>
              <div className={styles.hostFlex}>
                {icon && (
                  <Icon {...iconProps} icon={icon} className={styles.icon} />
                )}
                <span className={classNames(styles.text)}>{text}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={styles.externalIcon}
                  viewBox="0 0 24 24"
                  fill="#D9D9D9"
                >
                  <path d="M0 0h24v24H0z" fill="none" />
                  <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
                </svg>
              </div>
              {label && <span className={styles.label}>{label}</span>}
            </div>
          </a>
        );
      } else {
        return (
          <Link
            to={href}
            className={classNames(styles.button, {
              [styles.disabled]: disabled,
              [styles.active]: isActive,
            })}
            onClick={onClickHandler}
            data-action-id={dataActionId}
          >
            <div className={styles.hostBlock}>
              <div className={styles.hostFlex}>
                {icon && (
                  <Icon {...iconProps} icon={icon} className={styles.icon} />
                )}
                <span className={classNames(styles.text)}>{text}</span>
              </div>
              {label && <span className={styles.label}>{label}</span>}
            </div>
          </Link>
        );
      }
    } else {
      return (
        <button
          type="button"
          disabled={disabled}
          className={classNames(styles.button, {
            [styles.disabled]: disabled,
          })}
          onClick={onClickHandler}
          data-action-id={dataActionId}
        >
          <div className={styles.hostBlock}>
            <div className={styles.hostFlex}>
              {icon && (
                <Icon {...iconProps} icon={icon} className={styles.icon} />
              )}
              <span className={classNames(styles.text)}>{text}</span>
            </div>
            {label && <span className={styles.label}>{label}</span>}
          </div>
        </button>
      );
    }
  }, [
    href,
    hrefExternal,
    disabled,
    onClickHandler,
    dataActionId,
    icon,
    iconProps,
    text,
    label,
    isActive,
  ]);

  return <li className={classNames(styles.host, className)}>{button}</li>;
};
