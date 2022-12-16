import React, { FC, ReactNode } from 'react';

import { Heading, HeadingType, Paragraph } from '@sovryn/ui';

export type LOCStatProps = {
  label: ReactNode;
  value: ReactNode;
};

export const LOCStat: FC<LOCStatProps> = ({ value, label }) => {
  return (
    <div className="flex flex-col min-w-60">
      <Paragraph className="text-gray-30 mb-2 font-medium">{label}</Paragraph>
      <div className="bg-gray-80 py-4 px-3.5 rounded text-gray-10">
        <Heading className="font-medium" type={HeadingType.h1}>
          {value}
        </Heading>
      </div>
    </div>
  );
};
