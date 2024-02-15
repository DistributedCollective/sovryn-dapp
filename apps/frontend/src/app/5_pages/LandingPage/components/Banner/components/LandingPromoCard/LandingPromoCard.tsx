import React, { FC } from 'react';

import { Heading, Paragraph } from '@sovryn/ui';

type LandingPromoCardProps = {
  heading: React.ReactNode;
  description: string;
  actions: React.ReactNode;
};

export const LandingPromoCard: FC<LandingPromoCardProps> = ({
  heading,
  description,
  actions,
}) => (
  <div className="mx-1">
    <div className="select-none border-4 border-primary w-full bg-gray-80 h-60 rounded p-4 md:p-6 flex flex-col justify-between">
      <div>
        <Heading className="font-medium font-druk text-gray-10 tracking-wide antialiased text-[2rem] xs:text-[2.25rem] md:text-[2.875rem] leading-[3.75rem] uppercase">
          {heading}
        </Heading>
        <Paragraph className="font-medium leading-5 mt-2 text-sm">
          {description}
        </Paragraph>
      </div>
      <div className="flex items-center gap-6">{actions}</div>
    </div>
  </div>
);
