import React, { FC, useState } from 'react';

import { t } from 'i18next';

import { Accordion, AmountInput } from '@sovryn/ui';

import { translations } from '../../../../../../../../../locales/i18n';
import { useDepositContext } from '../../../../contexts/BobDepositModalContext';

const pageTranslations = translations.bobMarketMakingPage.depositModal;

export const SlippageSettings: FC = () => {
  const { maximumSlippage, setMaximumSlippage } = useDepositContext();

  const [isSlippageExpanded, setIsSlippageExpanded] = useState(false);

  return (
    <div className="bg-gray-90 px-2 py-4 mt-6 rounded">
      <Accordion
        label={t(pageTranslations.slippage)}
        open={isSlippageExpanded}
        onClick={() => setIsSlippageExpanded(!isSlippageExpanded)}
        labelClassName="justify-between"
      >
        <AmountInput
          value={maximumSlippage}
          onChange={e => setMaximumSlippage(e.target.value)}
          label={t(pageTranslations.maximumSlippage)}
          className="max-w-none w-full"
          unit="%"
          step={0.01}
          decimalPrecision={2}
          placeholder="0"
          max={100}
        />
      </Accordion>
    </div>
  );
};
