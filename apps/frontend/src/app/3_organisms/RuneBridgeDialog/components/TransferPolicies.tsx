import React, { useCallback, useState } from 'react';

import { t } from 'i18next';

import { Accordion } from '@sovryn/ui';

import { translations } from '../../../../locales/i18n';
import { RuneExplorerLink } from './RuneExplorerLink';

const translation = translations.runeBridge.limits;

type TransferPoliciesProps = {
  minimumAmount?: string;
  maximumAmount?: string;
  serviceFee?: string;
  minimumPostage?: string;
  supportedRunes?: string[];
  className?: string;
};

export const TransferPolicies: React.FC<TransferPoliciesProps> = ({
  minimumAmount,
  maximumAmount,
  serviceFee,
  minimumPostage,
  supportedRunes,
  className,
}) => {
  const [open, setOpen] = useState(true);
  const onClick = useCallback((toOpen: boolean) => setOpen(toOpen), []);

  return (
    <Accordion
      label={t(translation.title)}
      children={
        <div className="bg-gray-80 border rounded border-gray-50 p-3 text-xs text-gray-30">
          {minimumAmount && (
            <div className="flex justify-between mb-3">
              <span>{t(translation.minimumAmount)}</span>
              <span>{minimumAmount}</span>
            </div>
          )}

          {maximumAmount && (
            <div className="flex justify-between mb-3">
              <span>{t(translation.maximumAmount)}</span>
              <span>{maximumAmount}</span>
            </div>
          )}

          {minimumPostage && (
            <div className="flex justify-between mb-3">
              <span>{t(translation.minimumPostage)}</span>
              <span>{minimumPostage}</span>
            </div>
          )}

          {serviceFee && (
            <div className="flex justify-between">
              <span>{t(translation.serviceFee)}</span>
              <span>{serviceFee}</span>
            </div>
          )}

          {supportedRunes && (
            <div className="flex justify-between mt-3">
              <span>{t(translation.supportedRunes)}</span>
              <ul>
                {supportedRunes.map(rune => (
                  <li key={rune}>
                    <RuneExplorerLink rune={rune} />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      }
      className={className}
      open={open}
      onClick={onClick}
    />
  );
};
