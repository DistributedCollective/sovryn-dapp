import React, { useCallback, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { Accordion } from '@sovryn/ui';

import { translations } from '../../../../locales/i18n';

const translation = translations.fastBtc.limits;

type LimitsProps = {
  minimumAmount: string;
  maximumAmount: string;
  serviceFee: string;
};

export const Limits: React.FC<LimitsProps> = ({
  minimumAmount,
  maximumAmount,
  serviceFee,
}) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const onClick = useCallback((toOpen: boolean) => setOpen(toOpen), []);

  return (
    <>
      <Accordion
        label={t(translation.title)}
        children={
          <div className="bg-gray-80 border rounded border-gray-50 p-3 text-xs text-gray-30">
            <div className="flex justify-between mb-3">
              <span>{t(translation.minimumAmount)}</span>
              <span>{minimumAmount}</span>
            </div>

            <div className="flex justify-between mb-3">
              <span>{t(translation.maximumAmount)}</span>
              <span>{maximumAmount}</span>
            </div>

            <div className="flex justify-between">
              <span>{t(translation.serviceFee)}</span>
              <span>{serviceFee}</span>
            </div>
          </div>
        }
        className="mb-6"
        open={open}
        onClick={onClick}
      />
    </>
  );
};
