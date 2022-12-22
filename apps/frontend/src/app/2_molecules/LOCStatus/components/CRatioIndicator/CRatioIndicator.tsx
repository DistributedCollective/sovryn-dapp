import React, { FC } from 'react';

import classNames from 'classnames';

import { CR_THRESHOLDS } from '../../../../../utils/constants';

export type CRatioIndicatorProps = {
  className?: string;
  value: number;
};

export const CRatioIndicator: FC<CRatioIndicatorProps> = ({
  className,
  value,
}) => (
  <div
    className={classNames(
      'w-2.5 h-2.5 rounded-full transition-colors',
      className,
      {
        'bg-success': value >= CR_THRESHOLDS.middleEnd,
        'bg-primary-75':
          CR_THRESHOLDS.middleStart <= value && value < CR_THRESHOLDS.middleEnd,
        'bg-negative': value < CR_THRESHOLDS.middleStart,
      },
    )}
  />
);
