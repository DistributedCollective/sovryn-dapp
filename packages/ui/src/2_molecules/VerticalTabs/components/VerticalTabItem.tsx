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
  dataLayoutId,
  onClick,
}) => {
  return (
    <button
      className={classNames(styles.button, { [styles.active]: active })}
      disabled={disabled}
      {...applyDataAttr(dataLayoutId)}
      data-active={active}
      onClick={onClick}
    >
      <Heading type={HeadingType.h2}>{label}</Heading>
      {infoText && <Paragraph className={styles.info}>{infoText}</Paragraph>}
    </button>
  );
};
