import React, { FC, ReactNode } from 'react';

import { Paragraph } from '@sovryn/ui';

type DepositRowProps = {
  title: ReactNode;
  value: ReactNode;
  cta: ReactNode;
};

export const DepositRow: FC<DepositRowProps> = ({ title, value, cta }) => (
  <div className="grid items-center grid-cols-2 lg:grid-cols-[35%_40%_25%] gap-x-0.5 bg-gray-80 rounded py-[1.125rem] px-4 text-gray-10 font-medium">
    <Paragraph className="text-left">{title}</Paragraph>
    <Paragraph className="text-right">{value}</Paragraph>
    <div className="hidden lg:block text-right leading-4">{cta}</div>
  </div>
);
