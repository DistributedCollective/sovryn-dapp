import React, { FC, useCallback } from 'react';

import { Input } from './components/Input/Input';

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
      <Input
        onMinusClick={onMinPriceMinusClick}
        onPlusClick={onMinPricePlusClick}
        value={53410.56}
        range={10}
      />

      <Input
        onMinusClick={onMaxPriceMinusClick}
        onPlusClick={onMaxPricePlusClick}
        value={53410.56}
        range={10}
      />
    </div>
  );
};
