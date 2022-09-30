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
                {icon && <Icon icon={icon} className={styles.icon} />}
                <span className={classNames(styles.text)}>{text}</span>
                <Icon icon={'new-tab'} className={styles.externalIcon} />
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
                {icon && <Icon icon={icon} className={styles.icon} />}
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
              {icon && <Icon icon={icon} className={styles.icon} />}
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
    text,
    label,
    isActive,
  ]);

  return <li className={classNames(styles.host, className)}>{button}</li>;
};
