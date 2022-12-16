import React, { FC } from 'react';

import classNames from 'classnames';

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
        'bg-success': value >= 150,
        'bg-primary-75': 100 <= value && value < 150,
        'bg-negative': value < 100,
      },
    )}
  />
);
