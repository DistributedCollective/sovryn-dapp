import React, { ReactNode } from 'react';

import { Paragraph, ParagraphSize } from '@sovryn/ui';

export const renderDetail = (
  label: string,
  content: ReactNode,
  className: string,
) => (
  <div className="grid grid-cols-2 w-full text-gray-30 gap-3 mt-3">
    <Paragraph size={ParagraphSize.base} className="text-xs">
      {label}
    </Paragraph>
    <Paragraph size={ParagraphSize.base} className={`text-xs ${className}`}>
      {content}
    </Paragraph>
  </div>
);
