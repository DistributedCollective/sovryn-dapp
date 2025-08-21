import React, { FC } from 'react';

import classNames from 'classnames';

import { Heading, Paragraph } from '@sovryn/ui';

type LandingPromoCardProps = {
  heading: React.ReactNode;
  description: string;
  actions: React.ReactNode;
  className?: string;
};

export const LandingPromoCard: FC<LandingPromoCardProps> = ({
  heading,
  description,
  actions,
  className,
}) => (
  <div className="mx-1">
    <div
      className={classNames(
        'select-none border-4 w-full bg-gray-80 h-60 rounded p-4 md:p-6 flex flex-col justify-between',
        className,
      )}
    >
      <div>
        <Heading className="font-medium font-druk text-gray-10 tracking-wide antialiased text-[2rem] xs:text-[2.25rem] md:text-[2.875rem] leading-[3.75rem] uppercase">
          {heading}
        </Heading>
        <Paragraph className="font-medium leading-5 my-2 text-sm">
          {description}
        </Paragraph>
      </div>
      <div className="flex items-center gap-6">{actions}</div>
    </div>
  </div>
);
