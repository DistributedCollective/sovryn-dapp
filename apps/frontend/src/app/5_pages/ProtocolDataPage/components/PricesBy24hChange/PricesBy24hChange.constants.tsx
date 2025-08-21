import React from 'react';

import { t } from 'i18next';
import { Trans } from 'react-i18next';

import { HelperButton } from '@sovryn/ui';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { AssetRenderer } from '../../../../2_molecules/AssetRenderer/AssetRenderer';
import { USD } from '../../../../../constants/currencies';
import { translations } from '../../../../../locales/i18n';
import { decimalic } from '../../../../../utils/math';
import styles from './PricesBy24hChange.module.css';
import { CryptoPair } from './PricesBy24hChange.types';
import { PriceChange } from './components/PriceChange';

const translation = translations.protocolDataPage.pricesBy24hChange;

export const COLUMNS_CONFIG = [
  {
    id: 'asset',
    title: t(translation.asset),
    cellRenderer: (pair: CryptoPair) => (
      <AssetRenderer
        showAssetLogo
        address={pair.asset}
        logoClassName={styles.assetLogo}
        className="lg:justify-start justify-end"
        assetClassName="font-medium"
        showLongName
        assetLongNameClassName="ml-2 text-gray-40 hidden lg:block"
      />
    ),
  },
  {
    id: 'prices',
    title: t(translation.price),
    cellRenderer: (pair: CryptoPair) => (
      <div className="text-base">
        <AmountRenderer
          value={decimalic(pair.lastPrice).toString()}
          suffix={USD}
        />
      </div>
    ),
  },
  {
    id: '24h',
    title: t(translation['24h']),
    cellRenderer: (pair: CryptoPair) => <PriceChange value={pair.price24h} />,
  },
  {
    id: '7d',
    title: t(translation['7d']),
    cellRenderer: (pair: CryptoPair) => <PriceChange value={pair.priceWeek} />,
  },
  {
    id: 'marketCap',
    title: (
      <span className="flex items-center gap-1">
        {t(translation.marketCap)}
        <HelperButton
          content={
            <Trans
              i18nKey={t(translation.marketCapTooltip)}
              components={[<strong className="font-bold" />]}
            />
          }
        />
      </span>
    ),
    cellRenderer: (pair: CryptoPair) => (
      <AmountRenderer
        value={decimalic(pair.marketCap).toString()}
        suffix={USD}
      />
    ),
  },
  {
    id: 'circulationSupply',
    title: (
      <span className="flex items-center gap-1">
        {t(translation.circulatingSupply)}
        <HelperButton
          content={
            <Trans
              i18nKey={t(translation.circulatingSupplyTooltip)}
              components={[<strong className="font-bold" />]}
            />
          }
        />
      </span>
    ),
    cellRenderer: (pair: CryptoPair) => (
      <AmountRenderer value={decimalic(pair.circulatingSupply).toString()} />
    ),
  },
];

export const DEFAULT_PRICES_PAGE_SIZE = 8;
