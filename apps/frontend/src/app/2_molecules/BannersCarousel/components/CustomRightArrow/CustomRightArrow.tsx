import React from 'react';

import classNames from 'classnames';
import { ArrowProps } from 'react-multi-carousel';

import { Icon, IconNames } from '@sovryn/ui';

import styles from '../../BannersCarousel.module.css';

export const CustomRightArrow: React.FC<ArrowProps> = ({ onClick }) => (
  <div className={classNames(styles.arrow, 'right-0')} onClick={onClick}>
    <Icon icon={IconNames.ARROW_BACK} className="w-4 h-4 rotate-180" />
  </div>
);
