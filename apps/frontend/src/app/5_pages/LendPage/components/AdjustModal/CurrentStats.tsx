import React, { FC } from 'react';

import { t } from 'i18next';

import { SupportedTokens } from '@sovryn/contracts';
import { Paragraph } from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { AssetRenderer } from '../../../../2_molecules/AssetRenderer/AssetRenderer';
import { getTokenDisplayName } from '../../../../../constants/tokens';
import { translations } from '../../../../../locales/i18n';
import styles from './CurrentStats.module.css';

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
  <>
    <AssetRenderer
      logoClassName={styles.assetLogo}
      showAssetLogo
      asset={symbol}
    />
    <div className="flex gap-8">
      <div className="mt-6 flex flex-col gap-2">
        <Paragraph className="font-medium text-gray-30">
          {t(translations.lendingAdjust.apy)}
        </Paragraph>
        <AmountRenderer value={apy} suffix="%" />
      </div>
      <div className="mt-6 flex flex-col gap-2">
        <Paragraph className="font-medium text-gray-30">
          {t(translations.lendingAdjust.currentBalance)}
        </Paragraph>
        <AmountRenderer value={balance} suffix={getTokenDisplayName(symbol)} />
      </div>
    </div>
  </>
);
