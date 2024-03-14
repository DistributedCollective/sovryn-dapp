import React, { FC, useCallback } from 'react';

import { Button, ButtonStyle } from '@sovryn/ui';

import { AmountRenderer } from '../../../../../../../../2_molecules/AmountRenderer/AmountRenderer';

export const UnbalancedRange: FC = () => {
  const onMinPriceMinusClick = useCallback(() => {
    console.log(`min price minus click`);
  }, []);

  const onMinPricePlusClick = useCallback(() => {
    console.log(`min price plus click`);
  }, []);

  const onMaxPriceMinusClick = useCallback(() => {
    console.log(`max price minus click`);
  }, []);

  const onMaxPricePlusClick = useCallback(() => {
    console.log(`max price plus click`);
  }, []);

  return (
    <div className="flex justify-between px-4">
      <div className="flex flex-col items-center min-w-36">
        <div className="text-xs font-medium text-gray-30 mb-2">Min price</div>
        <div className="flex rounded bg-gray-80 px-2 py-4 w-full justify-between">
          <Button
            text="-"
            onClick={onMinPriceMinusClick}
            style={ButtonStyle.ghost}
            className="text-gray-30 text-base font-medium px-2"
          />
          <AmountRenderer
            value={53410.56}
            className="text-sm font-medium text-gray-10"
          />
          <Button
            text="+"
            onClick={onMinPricePlusClick}
            style={ButtonStyle.ghost}
            className="text-gray-30 text-base font-medium px-2"
          />
        </div>
        <div className="text-xs font-medium text-gray-30 mt-2">-10%</div>
      </div>

      <div className="flex flex-col items-center min-w-36">
        <div className="text-xs font-medium text-gray-30 mb-2">Max price</div>
        <div className="flex rounded bg-gray-80 px-2 py-4 w-full justify-between">
          <Button
            text="-"
            onClick={onMaxPriceMinusClick}
            style={ButtonStyle.ghost}
            className="text-gray-30 text-base font-medium px-2"
          />
          <AmountRenderer
            value={53410.56}
            className="text-sm font-medium text-gray-10"
          />
          <Button
            text="+"
            onClick={onMaxPricePlusClick}
            style={ButtonStyle.ghost}
            className="text-gray-30 text-base font-medium px-2"
          />
        </div>
        <div className="text-xs font-medium text-gray-30 mt-2">+10%</div>
      </div>
    </div>
  );
};
