import React, { FC, useState } from 'react';

import { t } from 'i18next';

import { Pool } from '@sovryn/sdk';
import { Accordion, Toggle, ToggleAlignment } from '@sovryn/ui';

import { translations } from '../../../../../../../locales/i18n';
import { useDepositContext } from '../../contexts/BobDepositModalContext';
import { BalancedRange } from './components/BalancedRange/BalancedRange';
import { UnbalancedRange } from './components/UnbalancedRange/UnbalancedRange';

type PriceRangeProps = {
  pool: Pool;
};

export const PriceRange: FC<PriceRangeProps> = ({ pool }) => {
  const { isBalancedRange, setIsBalancedRange } = useDepositContext();
  const [isPriceRangeExpanded, setIsPriceRangeExpanded] = useState(false);

  return (
    <div className="bg-gray-90 px-2 py-4 mt-4 rounded">
      <Accordion
        label={t(translations.bobMarketMakingPage.depositModal.priceRange)}
        open={isPriceRangeExpanded}
        onClick={() => setIsPriceRangeExpanded(!isPriceRangeExpanded)}
        labelClassName="justify-between"
        alwaysMounted
      >
        <div className="my-4">
          <Toggle
            checked={isBalancedRange}
            onChange={() => setIsBalancedRange(!isBalancedRange)}
            label={t(translations.bobMarketMakingPage.depositModal.balanced)}
            alignment={ToggleAlignment.RIGHT}
          />
        </div>

        <div>
          {isBalancedRange ? (
            <BalancedRange pool={pool} />
          ) : (
            <UnbalancedRange pool={pool} />
          )}
        </div>
      </Accordion>
    </div>
  );
};
