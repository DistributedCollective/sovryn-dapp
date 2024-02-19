import React from 'react';

import { t } from 'i18next';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { AssetRenderer } from '../../../../2_molecules/AssetRenderer/AssetRenderer';
import { translations } from '../../../../../locales/i18n';
import { decimalic } from '../../../../../utils/math';
import styles from './PricesBy24hChange.module.css';
import { PriceChange } from './components/PriceChange';

const translation = translations.protocolDataPage.pricesBy24hChange;

export const COLUMNS_CONFIG = [
  {
    id: 'asset',
    title: t(translation.asset),
    cellRenderer: pair => (
      <AssetRenderer
        showAssetLogo
        address={pair.asset}
        logoClassName={styles.assetLogo}
        className="lg:justify-start justify-end"
        showLongName
        assetLongNameClassName="ml-2 text-gray-40 hidden lg:block"
      />
    ),
  },
  {
    id: 'prices',
    title: t(translation.price),
    cellRenderer: pair => (
      <AmountRenderer
        value={decimalic(pair.lastPrice).toString()}
        prefix="$ "
      />
    ),
  },
  {
    id: '24h',
    title: t(translation['24h']),
    cellRenderer: pair => <PriceChange value={pair.price24h} />,
  },
  {
    id: '7d',
    title: t(translation['7d']),
    cellRenderer: pair => <PriceChange value={pair.priceWeek} />,
  },
  {
    id: 'marketCap',
    title: t(translation.marketCap),
    cellRenderer: pair => (
      <AmountRenderer
        value={decimalic(pair.marketCap).toString()}
        prefix="$ "
      />
    ),
  },
  {
    id: 'circulationSupply',
    title: t(translation.circulationSupply),
    cellRenderer: pair => (
      <AmountRenderer
        value={decimalic(pair.circulatingSupply).toString()}
        prefix="$ "
      />
    ),
  },
];
