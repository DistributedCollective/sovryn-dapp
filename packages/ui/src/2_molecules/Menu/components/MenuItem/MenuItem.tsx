import React, {
  ReactNode,
  MouseEventHandler,
  useMemo,
  useCallback,
} from 'react';

import classNames from 'classnames';

import { Icon } from '../../../../1_atoms';
import { IconType } from '../../../../1_atoms/Icon/Icon.types';
import styles from './MenuItem.module.css';

type MenuItemProps = {
  className?: string;
  icon?: IconType;
  text: ReactNode;
  label?: ReactNode;
  disabled?: boolean;
  isActive?: boolean;
  href?: string;
  hrefExternal?: boolean;
  onClick?: MouseEventHandler;
  dataLayoutId?: string;
};

export const MenuItem: React.FC<MenuItemProps> = ({
  className,
  icon,
  text,
  label,
  disabled,
  href,
  isActive,
  onClick,
  dataLayoutId,
  hrefExternal,
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

  const button = useMemo(() => {
    if (href) {
      return (
        <a
          className={classNames(styles.button, {
            [styles.disabled]: disabled,
            [styles.active]: isActive,
          })}
          href={href}
          target="_blank"
          rel="noreferrer"
          onClick={onClickHandler}
          data-layout-id={dataLayoutId}
        >
          <div className={styles.hostBlock}>
            <div className={styles.hostFlex}>
              {icon && <Icon icon={icon} className={styles.icon} />}
              <span className={classNames(styles.text)}>{text}</span>
              {hrefExternal && (
                <Icon icon={'new-tab'} className={styles.externalIcon} />
              )}
            </div>
            {label && <span className={styles.label}>{label}</span>}
          </div>
        </a>
      );
    } else {
      return (
        <button
          type="button"
          disabled={disabled}
          className={classNames(styles.button, {
            [styles.disabled]: disabled,
            [styles.active]: isActive,
          })}
          onClick={onClickHandler}
          data-layout-id={dataLayoutId}
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
    dataLayoutId,
    icon,
    text,
    label,
    isActive,
  ]);

  return <li className={classNames(styles.host, className)}>{button}</li>;
};
