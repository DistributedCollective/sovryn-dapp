import React, { FC } from 'react';

import { Paragraph } from '@sovryn/ui';

import { ExpandedContentInfoProps } from '../../../../LendFrame.types';

export const ExpandedContent: FC<ExpandedContentInfoProps> = ({
  value,
  label,
}) => (
  <div className="flex lg:block font-medium lg:mb-4">
    <Paragraph
      children={label}
      className="text-gray-30 inline-block mr-1 lg:mr-0 lg:mb-2 lg:block text-xs"
    />
    <div className="bg-gray-70 md:py-4 md:px-3.5 rounded md:text-2xl text-xs md:min-w-[22rem] text-gray-10  inline-block lg:block">
      {value}
    </div>
  </div>
);
