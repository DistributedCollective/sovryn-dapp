import React, { FC } from 'react';

import { t } from 'i18next';

import { SupportedTokens } from '@sovryn/contracts';
import { Decimal } from '@sovryn/utils';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { getTokenDisplayName } from '../../../../../constants/tokens';
import { translations } from '../../../../../locales/i18n';

export type CurrentStatsProps = {
  apy: Decimal;
  balance: Decimal;
  symbol: SupportedTokens;
};

export const CurrentStats: FC<CurrentStatsProps> = ({
  apy,
  balance,
  symbol,
}) => (
  <div className="flex flex-row justify-between mb-8">
    <div>
      <div>{t(translations.lendingAdjust.apy)}</div>
      <div>
        <AmountRenderer value={apy} suffix="%" />
      </div>
    </div>
    <div>
      <div>{t(translations.lendingAdjust.currentBalance)}</div>
      <div>
        <AmountRenderer value={balance} suffix={getTokenDisplayName(symbol)} />
      </div>
    </div>
  </div>
);
