import React, { ReactNode, FC } from 'react';

import classNames from 'classnames';

import { Heading } from '../Heading/Heading';
import { HeadingType } from '../Heading/Heading.types';
import { Icon } from '../Icon/Icon';
import { IconNames } from '../Icon/Icon.types';
import styles from './Accordion.module.css';

export interface IAccordionProps {
  label: string | ReactNode;
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
  return (
    <div className={classNames(styles.accordion, className)}>
      <div
        className={classNames(styles.label, {
          [styles.disabled]: disabled,
        })}
        onClick={() => !disabled && onClick?.(!open)}
        data-layout-id={dataLayoutId}
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
            icon={open ? IconNames.ARROW_DOWN : IconNames.ARROW_UP}
            size={8}
          />
        </div>
      </div>
      {open && (
        <div
          className={styles.content}
          data-layout-id={`${dataLayoutId}-content`}
        >
          {children}
        </div>
      )}
    </div>
  );
};
