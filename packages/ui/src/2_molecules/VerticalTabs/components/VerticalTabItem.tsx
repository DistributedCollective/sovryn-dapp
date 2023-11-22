import React, { FC } from 'react';

import classNames from 'classnames';

import { Heading, HeadingType, Paragraph } from '../../../1_atoms';
import { applyDataAttr } from '../../../utils';
import { VerticalTabsItemButtonProps } from '../VerticalTabs.types';
import styles from './VerticalTabItem.module.css';

export const VerticalTabItem: FC<VerticalTabsItemButtonProps> = ({
  disabled,
  label,
  infoText,
  active,
  dataAttribute,
  onClick,
  icon,
  className,
}) => {
  return (
    <button
      className={classNames(styles.button, { [styles.active]: active })}
      disabled={disabled}
      {...applyDataAttr(dataAttribute)}
      data-active={active}
      onClick={onClick}
    >
      {icon && <span className={styles.icon}> {icon} </span>}
      <div className={className}>
        <Heading className={styles.heading} type={HeadingType.h2}>
          {label}
        </Heading>
        {infoText && <Paragraph className={styles.info}>{infoText}</Paragraph>}
      </div>
    </button>
  );
};
