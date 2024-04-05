import React, { FC } from 'react';

import { Button, ButtonStyle, Paragraph } from '@sovryn/ui';

type CTAProps = {
  index: number;
  backgroundImage: string;
  title: string;
  description: string;
  action: string;
  navigateTo: () => void;
};

export const CTA: FC<CTAProps> = ({
  index,
  backgroundImage,
  title,
  description,
  action,
  navigateTo,
}) => (
  <div
    key={index}
    className="relative p-4 md:p-6 bg-gray-70 rounded flex flex-col md:items-start justify-end md:min-h-60 min-h-40"
  >
    <img
      src={backgroundImage}
      alt={title}
      className="absolute top-0 right-0 md:max-w-none max-w-14"
    />
    <Paragraph
      className="mb-6 font-medium text-sm xl:max-w-36 xl:pr-0 pr-12"
      children={title}
    />
    <Paragraph
      className="mb-4 md:mb-6 font-medium xl:pr-0 pr-12 text-gray-30"
      children={description}
    />
    <Button
      className="w-full sm:w-auto"
      text={action}
      onClick={navigateTo}
      style={ButtonStyle.secondary}
    />
  </div>
);
