import React, { FC } from 'react';

import { Badge, BadgeStyle, Button, ButtonStyle, Paragraph } from '@sovryn/ui';

type CTAProps = {
  index: number;
  backgroundImage: string;
  title: string;
  description: string;
  action: string;
  navigateTo: () => void;
  badges?: string[];
};

export const CTA: FC<CTAProps> = ({
  index,
  backgroundImage,
  title,
  description,
  action,
  navigateTo,
  badges,
}) => (
  <div
    key={index}
    className="relative px-4 py-6 md:p-6 bg-gray-70 rounded flex flex-col md:items-start justify-end md:min-h-60 min-h-40"
  >
    {badges && badges.length > 0 && (
      <div className="absolute md:left-6 left-4 md:top-4 top-2 flex items-center">
        {badges?.map((badge, index) => (
          <Badge
            key={index}
            content={badge.toUpperCase()}
            className="flex justify-center items-center mr-1.5 h-[0.875rem] min-w-[1.438rem] rounded font-medium text-[0.563rem] py-1"
            style={BadgeStyle.teal}
          />
        ))}
      </div>
    )}
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
