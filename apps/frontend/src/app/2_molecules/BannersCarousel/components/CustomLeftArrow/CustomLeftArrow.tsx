import React from 'react';

import classNames from 'classnames';
import { ArrowProps } from 'react-multi-carousel';

import { Icon, IconNames } from '@sovryn/ui';

import styles from './CustomLeftArrow.module.css';

export const CustomLeftArrow: React.FC<ArrowProps> = ({ onClick }) => (
  <div className={classNames(styles.arrow, 'left-2')} onClick={onClick}>
    <Icon icon={IconNames.ARROW_BACK} className="w-4 h-4" />
  </div>
);
