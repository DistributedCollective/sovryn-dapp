import React, { PropsWithChildren, ReactNode } from 'react';

import classNames from 'classnames';

import { Heading, HeadingType, Paragraph } from '../../1_atoms';
import styles from './FormGroup.module.css';

type FormGroupProps = {
  className?: string;
  label?: string;
  helper?: ReactNode;
  subtext?: string;
  dataLayoutId?: string;
  errorLabel?: string;
};

export const FormGroup: React.FC<PropsWithChildren<FormGroupProps>> = ({
  className,
  label,
  helper,
  subtext,
  children,
  errorLabel,
  dataLayoutId,
}) => (
  <div
    data-layout-id={dataLayoutId}
    className={classNames(className, styles.formGroup)}
  >
    {(label || subtext) && (
      <label className={styles.formLabel}>
        {label && (
          <Heading className={styles.heading} type={HeadingType.h3}>
            {label} {helper}
          </Heading>
        )}
        {subtext && <Paragraph>{subtext}</Paragraph>}
      </label>
    )}
    {children}
    {errorLabel && (
      <span
        data-layout-id={`${dataLayoutId}__error-message`}
        className={styles.errorLabel}
      >
        {errorLabel}
      </span>
    )}
  </div>
);
