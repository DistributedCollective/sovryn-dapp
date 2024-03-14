import React, { FC, useState } from 'react';

import { Accordion, Toggle, ToggleAlignment } from '@sovryn/ui';

import { BalancedRange } from './components/BalancedRange/BalancedRange';
import { UnbalancedRange } from './components/UnbalancedRange/UnbalancedRange';

export const PriceRange: FC = () => {
  const [isPriceRangeExpanded, setIsPriceRangeExpanded] = useState(false);
  const [isBalanced, setIsBalanced] = useState(true);

  return (
    <div className="bg-gray-90 px-2 py-4 mt-6 rounded">
      <Accordion
        label="Price range"
        open={isPriceRangeExpanded}
        onClick={() => setIsPriceRangeExpanded(!isPriceRangeExpanded)}
        labelClassName="justify-between"
      >
        <div className="my-4">
          <Toggle
            checked={isBalanced}
            onChange={() => setIsBalanced(!isBalanced)}
            label="Balanced"
            alignment={ToggleAlignment.RIGHT}
          />
        </div>

        <div>{isBalanced ? <BalancedRange /> : <UnbalancedRange />}</div>
      </Accordion>
    </div>
  );
};
