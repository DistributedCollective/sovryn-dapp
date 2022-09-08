import { FC, ReactNode, MouseEventHandler, useMemo, useCallback } from 'react';

import classNames from 'classnames';
import { Link, useLocation } from 'react-router-dom';

import { Icon } from '../../../../1_atoms';
import { IconType } from '../../../../1_atoms/Icon/Icon.types';
import iconNewTab from '../../../../../assets/storybook/iconNewTab.svg';
import styles from './MenuItem.module.css';

type MenuItemProps = {
  className?: string;
  icon?: IconType;
  text: ReactNode;
  label?: ReactNode;
  disabled?: boolean;
  href?: string;
  hrefExternal?: boolean;
  onClick?: MouseEventHandler;
  dataActionId?: string;
};

export const MenuItem: FC<MenuItemProps> = ({
  className,
  icon,
  text,
  label,
  disabled,
  href,
  hrefExternal,
  onClick,
  dataActionId,
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
            <div className="block leading-none">
              <div className="flex items-center">
                {icon && <Icon icon={icon} className="mr-2" />}
                <span
                  className={classNames(styles.text, {
                    'mb-1': !!label,
                  })}
                >
                  {text}
                </span>
                <img
                  src={iconNewTab}
                  className="ml-2 h-5"
                  alt="external link"
                />
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
            <div className="block leading-none">
              <div className="flex items-center">
                {icon && <Icon icon={icon} className="mr-2" />}
                <span
                  className={classNames(styles.text, {
                    'mb-1': !!label,
                  })}
                >
                  {text}
                </span>
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
          <div className="block leading-none">
            <div className="flex items-center">
              {icon && <Icon icon={icon} className="mr-2" />}
              <span
                className={classNames(styles.text, {
                  'mb-1': !!label,
                })}
              >
                {text}
              </span>
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
    label,
    text,
    isActive,
  ]);

  return <li className={classNames(styles.host, className)}>{button}</li>;
};
