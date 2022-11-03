import React, { ReactNode, FC, useCallback } from 'react';

import classNames from 'classnames';

import { applyDataAttr } from '../../utils';
import { Heading } from '../Heading/Heading';
import { HeadingType } from '../Heading/Heading.types';
import { Icon } from '../Icon/Icon';
import { IconNames } from '../Icon/Icon.types';
import styles from './Accordion.module.css';

export interface IAccordionProps {
  label: ReactNode;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  open?: boolean;
  onClick?: (toOpen: boolean) => void;
  dataLayoutId?: string;
}

export const Accordion: FC<IAccordionProps> = ({
  label,
  children,
  className,
  disabled = false,
  open = false,
  onClick,
  dataLayoutId,
}) => {
  const onClickCallback = useCallback(
    () => !disabled && onClick?.(!open),
    [disabled, open, onClick],
  );

  return (
    <div className={classNames(styles.accordion, className)}>
      <button
        className={classNames(styles.label, {
          [styles.disabled]: disabled,
        })}
        onClick={onClickCallback}
        {...applyDataAttr(dataLayoutId)}
      >
        <>
          {typeof label === 'string' ? (
            <Heading type={HeadingType.h3}>{label}</Heading>
          ) : (
            label
          )}
        </>
        <div className={styles.arrow}>
          <Icon
            icon={IconNames.ARROW_DOWN}
            size={8}
            className={classNames(styles.icon, {
              [styles.isOpen]: open,
            })}
          />
        </div>
      </button>
      {open && (
        <div
          className={styles.content}
          {...applyDataAttr(`${dataLayoutId}-content`)}
        >
          {children}
        </div>
      )}
    </div>
  );
};
