import React, { FC } from 'react';

import { Button, ButtonStyle } from '@sovryn/ui';

import { AmountRenderer } from '../../../../../../../../../../2_molecules/AmountRenderer/AmountRenderer';

type InputProps = {
  label: string;
  value: number;
  range: number;
  text: number;
  onMinusClick: () => void;
  onPlusClick: () => void;
  decimals: number;
};

export const Input: FC<InputProps> = ({
  label,
  text,
  range,
  onMinusClick,
  onPlusClick,
  decimals,
}) => (
  <div className="flex flex-col items-center min-w-36">
    <div className="text-xs font-medium text-gray-30 mb-2">{label}</div>
    <div className="flex rounded bg-gray-80 p-3 w-full justify-between">
      <Button
        text="-"
        onClick={onMinusClick}
        style={ButtonStyle.ghost}
        className="text-gray-30 text-base font-medium px-2"
      />
      <AmountRenderer
        value={text}
        className="text-sm font-medium text-gray-10"
        decimals={decimals}
        precision={6}
        asIf
      />
      <Button
        text="+"
        onClick={onPlusClick}
        style={ButtonStyle.ghost}
        className="text-gray-30 text-base font-medium px-2"
      />
    </div>
    <div className="text-xs font-medium text-gray-30 mt-2">{`${
      range < 1 ? '' : '+'
    }${range}%`}</div>
  </div>
);
