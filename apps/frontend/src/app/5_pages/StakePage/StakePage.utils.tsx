import React, { FC } from 'react';

import classNames from 'classnames';

import { StakingStatRenderProps } from './StakePage.types';

export const PersonalStatRender: FC<StakingStatRenderProps> = ({
  value,
  label,
  className,
}) => (
  <div className="flex flex-col font-medium">
    <div className="text-gray-30 mb-2 leading-4 text-xs">{label}</div>
    <div
      className={classNames(
        className,
        'bg-gray-90 md:bg-gray-80 md:py-2.5 md:px-3.5 rounded md:text-[2.25rem] md:min-w-[23.25rem] text-xl uppercase text-gray-10',
      )}
    >
      {value}
    </div>
  </div>
);

export const GlobalStatRender: FC<StakingStatRenderProps> = ({
  value,
  label,
}) => (
  <div className="flex md:flex-col flex-row md:items-start items-center justify-between md:min-w-60 font-medium">
    <div className="text-gray-30 md:mb-3 leading-4 text-xs">{label}</div>
    <div className="text-base uppercase text-gray-10">{value}</div>
  </div>
);
