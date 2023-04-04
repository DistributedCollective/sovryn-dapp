import React, { FC } from 'react';

import classNames from 'classnames';

import { COLLATERAL_RATIO_THRESHOLDS } from '../../../../../constants/general';

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
        'bg-success': value >= COLLATERAL_RATIO_THRESHOLDS.MIDDLE_END,
        'bg-primary-75':
          COLLATERAL_RATIO_THRESHOLDS.MIDDLE_START <= value &&
          value < COLLATERAL_RATIO_THRESHOLDS.MIDDLE_END,
        'bg-negative': value < COLLATERAL_RATIO_THRESHOLDS.MIDDLE_START,
      },
    )}
  />
);
