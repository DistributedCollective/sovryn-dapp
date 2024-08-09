import React from 'react';

import classNames from 'classnames';

import { HelperButton } from '@sovryn/ui';

import {
  AmountRenderer,
  AmountRendererProps,
} from '../../../../2_molecules/AmountRenderer/AmountRenderer';

type PoolPositionStatProps = AmountRendererProps & {
  label: string;
  labelInfo?: string;
};

export const PoolPositionStat: React.FC<PoolPositionStatProps> = ({
  label,
  labelInfo,
  className,
  ...props
}) => {
  return (
    <div
      className={classNames(
        'flex items-center justify-between lg:gap-2 lg:px-3 lg:py-2 lg:rounded-md lg:bg-gray-70 text-gray-30',
        className,
      )}
    >
      <span className="text-xs  font-medium flex">
        {label}{' '}
        {labelInfo && (
          <HelperButton className="ml-1 lg:hidden" content={labelInfo} />
        )}
      </span>

      <div className="flex gap-[6px] items-center">
        <AmountRenderer
          {...props}
          className="text-xs  font-medium lg:text-sm lg:text-white"
        />

        {labelInfo && (
          <HelperButton className="ml-1 hidden lg:block" content={labelInfo} />
        )}
      </div>
    </div>
  );
};
