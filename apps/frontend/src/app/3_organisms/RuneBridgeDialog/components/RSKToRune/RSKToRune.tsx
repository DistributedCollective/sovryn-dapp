import React from 'react';

import { t } from 'i18next';

import { AmountInput, FormGroup, Heading } from '@sovryn/ui';

import {
  BITCOIN,
  BTC_RENDER_PRECISION,
} from '../../../../../constants/currencies';
import { translations } from '../../../../../locales/i18n';

interface RSKToRuneProps {
  onClose: () => void;
}
export const RSKToRune: React.FC<RSKToRuneProps> = ({ onClose }) => {
  return (
    <FormGroup>
      <Heading>RSK to Rune</Heading>
      <AmountInput
        label={t(translations.common.amount)}
        unit={BITCOIN}
        decimalPrecision={BTC_RENDER_PRECISION}
        className="max-w-none"
        dataAttribute="funding-send-amount-input"
      />
    </FormGroup>
  );
};
