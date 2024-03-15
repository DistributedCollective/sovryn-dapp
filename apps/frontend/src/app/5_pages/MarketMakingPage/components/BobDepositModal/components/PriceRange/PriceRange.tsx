import React, { FC, useState } from 'react';

import { t } from 'i18next';

import { Accordion, Toggle, ToggleAlignment } from '@sovryn/ui';

import { translations } from '../../../../../../../locales/i18n';
import { BalancedRange } from './components/BalancedRange/BalancedRange';
import { UnbalancedRange } from './components/UnbalancedRange/UnbalancedRange';

export const PriceRange: FC = () => {
  const [isPriceRangeExpanded, setIsPriceRangeExpanded] = useState(false);
  const [isBalanced, setIsBalanced] = useState(true);

  return (
    <div className="bg-gray-90 px-2 py-4 mt-6 rounded">
      <Accordion
        label={t(translations.bobMarketMakingPage.depositModal.priceRange)}
        open={isPriceRangeExpanded}
        onClick={() => setIsPriceRangeExpanded(!isPriceRangeExpanded)}
        labelClassName="justify-between"
      >
        <div className="my-4">
          <Toggle
            checked={isBalanced}
            onChange={() => setIsBalanced(!isBalanced)}
            label={t(translations.bobMarketMakingPage.depositModal.balanced)}
            alignment={ToggleAlignment.RIGHT}
          />
        </div>

        <div>
          {isBalanced ? (
            <BalancedRange />
          ) : (
            <UnbalancedRange
              lowerBoundaryPercentage={10}
              lowerBoundaryPrice={53410.56}
              upperBoundaryPercentage={10}
              upperBoundaryPrice={53410.56}
            />
          )}
        </div>
      </Accordion>
    </div>
  );
};
