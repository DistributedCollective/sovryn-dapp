import React, {
  PropsWithChildren,
  ReactNode,
  useMemo,
  createElement,
} from 'react';

import classNames from 'classnames';

import {
  ErrorBadge,
  ErrorLevel,
  Heading,
  HeadingType,
  Paragraph,
  ParagraphSize,
} from '../../1_atoms';
import { applyDataAttr } from '../../utils';
import styles from './FormGroup.module.css';

type FormGroupProps = {
  className?: string;
  label?: ReactNode;
  helper?: ReactNode;
  subtext?: string;
  dataAttribute?: string;
  errorLabel?: string;
  labelElement?: keyof React.ReactHTML;
};

export const FormGroup: React.FC<PropsWithChildren<FormGroupProps>> = ({
  className,
  label,
  helper,
  subtext,
  children,
  errorLabel,
  dataAttribute,
  labelElement = 'label',
}) => {
  const maybeRenderLabel = useMemo(() => {
    if (!label && !subtext) {
      return null;
    }

    return createElement(labelElement, {
      className: styles.formLabel,
      children: (
        <>
          {label && (
            <Heading className={styles.heading} type={HeadingType.h3}>
              {label} {helper}
            </Heading>
          )}
          {subtext && (
            <Paragraph size={ParagraphSize.tiny} className={styles.subtext}>
              {subtext}
            </Paragraph>
          )}
        </>
      ),
    });
  }, [helper, label, labelElement, subtext]);

  return (
    <div
      {...applyDataAttr(dataAttribute)}
      className={classNames(className, styles.formGroup)}
    >
      {maybeRenderLabel}
      {children}
      {errorLabel && (
        <ErrorBadge
          level={ErrorLevel.Critical}
          message={errorLabel}
          dataAttribute={`${dataAttribute}__error-message`}
        />
      )}
    </div>
  );
};
