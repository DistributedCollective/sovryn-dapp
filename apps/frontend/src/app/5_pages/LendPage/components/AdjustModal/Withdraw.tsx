import React, { FC } from 'react';

import { Decimal } from '@sovryn/utils';

import { FullAdjustModalState } from './AdjustLendingModalContainer';

export type WidthdrawProps = {
  state: FullAdjustModalState;
  onConfirm: (amount: Decimal) => void;
};

export const Withdraw: FC<WidthdrawProps> = () => {
  return <>withdraw</>;
};
