import React, { FC, ReactNode } from 'react';

import { Paragraph, ParagraphSize } from '@sovryn/ui';

type ProposalRenderDetailProps = {
  label: string;
  content: ReactNode;
  className?: string;
};

export const ProposalRenderDetail: FC<ProposalRenderDetailProps> = ({
  label,
  content,
  className,
}) => (
  <div className="grid grid-cols-2 w-full text-gray-30 gap-3 mt-3">
    <Paragraph size={ParagraphSize.base} className="text-xs">
      {label}
    </Paragraph>
    <Paragraph
      size={ParagraphSize.base}
      className={`text-xs text-right ${className}`}
    >
      {content}
    </Paragraph>
  </div>
);
