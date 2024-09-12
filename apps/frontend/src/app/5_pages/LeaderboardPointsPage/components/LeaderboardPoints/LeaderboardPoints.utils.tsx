import React from 'react';

import { Paragraph, prettyTx } from '@sovryn/ui';

export const generateRowTitle = (id: number, wallet: string) => (
  <Paragraph className="flex justify-between w-full">
    <span>{id}</span>
    <span>{prettyTx(wallet, 4)}</span>
  </Paragraph>
);
