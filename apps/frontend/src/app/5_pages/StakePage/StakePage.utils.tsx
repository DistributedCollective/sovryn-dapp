import React, { FC } from 'react';

import { StakingStatRenderProps } from './StakePage.types';

export const StakingStatRender: FC<StakingStatRenderProps> = ({
  value,
  label,
}) => {
  return (
    <div className="flex flex-col md:min-w-72">
      <div className="text-gray-30 mb-2 font-medium leading-4 text-xs">
        {label}
      </div>
      <div className="bg-gray-80 md:py-4 md:px-3.5 rounded text-2xl leading-7 uppercase text-gray-10">
        {value}
      </div>
    </div>
  );
};
