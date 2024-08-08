import React, { FC } from 'react';

import { t } from 'i18next';

import { HelperButton } from '@sovryn/ui';

import {
  AmountRenderer,
  AmountRendererProps,
} from '../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { translations } from '../../../../../../../locales/i18n';

type WalletStatCardProps = Partial<AmountRendererProps> & {
  label: string;
  helperContent?: string;
};

export const WalletStatCard: FC<WalletStatCardProps> = ({
  label,
  value,
  helperContent,
  ...props
}) => {
  return (
    <div className="space-y-3">
      <div className="flex space-x-2 items-center">
        <span className="text-xs text-gray-30">{label}</span>
        {helperContent && <HelperButton content={helperContent} />}
      </div>

      <div className="text-2xl text-white">
        {value ? (
          <AmountRenderer value={value} {...props} />
        ) : (
          <span>{t(translations.aavePage.topPanel['n/a'])}</span>
        )}
      </div>
    </div>
  );
};
