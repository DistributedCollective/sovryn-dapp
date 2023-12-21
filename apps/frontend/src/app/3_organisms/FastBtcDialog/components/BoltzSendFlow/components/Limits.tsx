import React, { useCallback, useState } from 'react';

import { t } from 'i18next';

import { Accordion } from '@sovryn/ui';
import { Decimalish } from '@sovryn/utils';

import { AmountRenderer } from '../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { BITCOIN } from '../../../../../../constants/currencies';
import { translations } from '../../../../../../locales/i18n';

const translation = translations.boltz.send.limits;

type LimitsProps = {
  minimumAmount: Decimalish;
  maximumAmount: Decimalish;
  conversionRate: Decimalish;
  conversionFee: Decimalish;
  networkFee: Decimalish;
  className?: string;
};

export const Limits: React.FC<LimitsProps> = ({
  minimumAmount,
  maximumAmount,
  conversionFee,
  conversionRate,
  networkFee,
  className,
}) => {
  const [open, setOpen] = useState(true);
  const onClick = useCallback((toOpen: boolean) => setOpen(toOpen), []);

  return (
    <>
      <Accordion
        label={t(translation.title)}
        children={
          <div className="bg-gray-80 border rounded border-gray-50 p-3 text-xs text-gray-30">
            <div className="flex justify-between mb-3">
              <span>{t(translation.minimumAmount)}</span>
              <AmountRenderer value={minimumAmount} suffix={BITCOIN} />
            </div>

            <div className="flex justify-between mb-3">
              <span>{t(translation.maximumAmount)}</span>
              <AmountRenderer value={maximumAmount} suffix={BITCOIN} />
            </div>

            <div className="flex justify-between mb-3">
              <span>
                {t(translation.serviceFee, { rate: conversionRate.toString() })}
              </span>
              <AmountRenderer value={conversionFee} suffix={BITCOIN} />
            </div>

            <div className="flex justify-between">
              <span>{t(translation.networkFee)}</span>
              <AmountRenderer value={networkFee} suffix={BITCOIN} />
            </div>
          </div>
        }
        className={className}
        open={open}
        onClick={onClick}
      />
    </>
  );
};
