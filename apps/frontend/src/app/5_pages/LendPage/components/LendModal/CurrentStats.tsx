import React, { FC } from 'react';

import { t } from 'i18next';

import { SupportedTokens } from '@sovryn/contracts';
import { Link } from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { AssetRenderer } from '../../../../2_molecules/AssetRenderer/AssetRenderer';
import { translations } from '../../../../../locales/i18n';
import styles from './CurrentStats.module.css';

export type CurrentStatsProps = {
  apy: Decimal;
  token: SupportedTokens;
};

export const CurrentStats: FC<CurrentStatsProps> = ({ apy, token }) => (
  <div className="flex flex-col bg-gray-90 px-4 pt-2 pb-4 rounded">
    <AssetRenderer
      logoClassName={styles.assetLogo}
      showAssetLogo
      asset={token}
    />
    <div className="flex gap-8">
      <div className="mt-6 flex flex-col gap-1 text-sm">
        <div className="text-gray-30">{t(translations.lending.apy)}</div>
        <AmountRenderer value={apy} suffix="%" />
      </div>
      <div className="mt-6 flex flex-col gap-2 text-sm">
        <div className="text-gray-30">
          {t(translations.lending.acceptedCollateral)}
        </div>
        <Link text="BTC, ZUSD, USDT and more" href={''} />
      </div>
    </div>
  </div>
);
