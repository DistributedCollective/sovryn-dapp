import React, { FC, ReactNode } from 'react';

import { Paragraph, ParagraphSize } from '@sovryn/ui';

type TokenButtonProps = {
  label: string;
  logo: ReactNode;
  title: string;
  onClick: () => void;
};

export const TokenButton: FC<TokenButtonProps> = ({
  title,
  label,
  logo,
  onClick,
}) => (
  <div>
    <div className="pt-3 pb-2 px-4">
      <Paragraph
        size={ParagraphSize.small}
        className="text-gray-40 font-medium"
      >
        {title}
      </Paragraph>
    </div>
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3 w-full hover:bg-gray-70"
    >
      {logo}
      <Paragraph className="font-medium">{label}</Paragraph>
    </button>
  </div>
);
