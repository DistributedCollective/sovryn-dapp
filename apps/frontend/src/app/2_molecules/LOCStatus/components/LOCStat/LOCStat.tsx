import React, { FC, ReactNode } from 'react';

export type LOCStatProps = {
  label: ReactNode;
  value: ReactNode;
};

export const LOCStat: FC<LOCStatProps> = ({ value, label }) => {
  return (
    <div className="flex flex-col md:min-w-60">
      <div className="text-gray-30 mb-2 font-medium leading-4 text-xs">
        {label}
      </div>
      <div className="bg-gray-80 md:py-4 md:px-3.5 rounded text-gray-10">
        <span className="font-medium text-2xl md:text-[2.25rem] leading-[2.625rem]">
          {value}
        </span>
      </div>
    </div>
  );
};
