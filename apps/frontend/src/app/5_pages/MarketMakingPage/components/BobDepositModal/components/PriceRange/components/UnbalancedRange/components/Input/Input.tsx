import React, { FC } from 'react';

import { Button, ButtonStyle } from '@sovryn/ui';

import { AmountRenderer } from '../../../../../../../../../../2_molecules/AmountRenderer/AmountRenderer';

type InputProps = {
  value: number;
  range: number;
  onMinusClick: () => void;
  onPlusClick: () => void;
};

export const Input: FC<InputProps> = ({
  value,
  range,
  onMinusClick,
  onPlusClick,
}) => (
  <div className="flex flex-col items-center min-w-36">
    <div className="text-xs font-medium text-gray-30 mb-2">Min price</div>
    <div className="flex rounded bg-gray-80 px-2 py-4 w-full justify-between">
      <Button
        text="-"
        onClick={onMinusClick}
        style={ButtonStyle.ghost}
        className="text-gray-30 text-base font-medium px-2"
      />
      <AmountRenderer
        value={value}
        className="text-sm font-medium text-gray-10"
      />
      <Button
        text="+"
        onClick={onPlusClick}
        style={ButtonStyle.ghost}
        className="text-gray-30 text-base font-medium px-2"
      />
    </div>
    <div className="text-xs font-medium text-gray-30 mt-2">-{range}%</div>
  </div>
);
