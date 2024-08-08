import React from 'react';

import classNames from 'classnames';

import {
  AmountRenderer,
  AmountRendererProps,
} from '../../../../../../2_molecules/AmountRenderer/AmountRenderer';

type LendPositionStatProps = AmountRendererProps & {
  label: string;
  labelInfo?: string;
};

export const LendPositionStat: React.FC<LendPositionStatProps> = ({
  label,
  className,
  ...props
}) => {
  return (
    <div
      className={classNames(
        'flex items-center justify-between lg:gap-2 lg:px-3 lg:py-2 lg:rounded-md lg:bg-gray-70',
        className,
      )}
    >
      <span className="text-xs text-gray-30 font-medium">{label}</span>
      <AmountRenderer
        {...props}
        className="text-xs text-gray-30 font-medium lg:text-sm lg:text-white"
      />
    </div>
  );
};
