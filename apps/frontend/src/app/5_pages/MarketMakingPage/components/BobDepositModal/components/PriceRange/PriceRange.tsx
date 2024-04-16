import React, { FC, useState } from 'react';

import { t } from 'i18next';

import { Accordion, Toggle, ToggleAlignment } from '@sovryn/ui';

import { translations } from '../../../../../../../locales/i18n';
import { useDepositContext } from '../../contexts/BobDepositModalContext';
import { BalancedRange } from './components/BalancedRange/BalancedRange';
import { UnbalancedRange } from './components/UnbalancedRange/UnbalancedRange';

export const PriceRange: FC = () => {
  const { isBalancedRange, setIsBalancedRange } = useDepositContext();
  const [isPriceRangeExpanded, setIsPriceRangeExpanded] = useState(false);

  return (
    <div className="bg-gray-90 px-2 py-4 mt-4 rounded">
      <Accordion
        label={t(translations.bobMarketMakingPage.depositModal.priceRange)}
        open={isPriceRangeExpanded}
        onClick={() => setIsPriceRangeExpanded(!isPriceRangeExpanded)}
        labelClassName="justify-between"
      >
        <div className="my-4">
          <Toggle
            checked={isBalancedRange}
            onChange={() => setIsBalancedRange(!isBalancedRange)}
            label={t(translations.bobMarketMakingPage.depositModal.balanced)}
            alignment={ToggleAlignment.RIGHT}
          />
        </div>

        <div>{isBalancedRange ? <BalancedRange /> : <UnbalancedRange />}</div>
      </Accordion>
    </div>
  );
};
