import React from 'react';

import { t } from 'i18next';

import { ButtonStyle, Button, HelperButton } from '@sovryn/ui';

import { AssetPairRenderer } from '../../../../2_molecules/AssetPairRenderer/AssetPairRenderer';
import { translations } from '../../../../../locales/i18n';
import { AmmLiquidityPool } from '../../utils/AmmLiquidityPool';

export const COLUMNS_CONFIG = [
  {
    id: 'pair',
    title: t(translations.marketMakingPage.table.pair),
    cellRenderer: (pool: AmmLiquidityPool) => (
      <AssetPairRenderer asset1={pool.assetA} asset2={pool.assetB} />
    ),
  },
  {
    id: 'liquidity',
    title: t(translations.marketMakingPage.table.liquidity),
    cellRenderer: (pool: AmmLiquidityPool) => (
      <div className="flex flex-col">
        <span>100,000 {pool.assetA}</span>
        <span>4 {pool.assetB}</span>
      </div>
    ),
  },
  {
    id: 'returns',
    title: (
      <span className="flex items-center gap-1">
        {t(translations.marketMakingPage.table.returns)}{' '}
        <HelperButton
          content={t(translations.marketMakingPage.table.returnsInfo)}
        />
      </span>
    ),
    cellRenderer: () => 'Up to 8.55% APR',
  },
  {
    id: 'volume',
    title: t(translations.marketMakingPage.table.volume),
    cellRenderer: () => '10',
  },
  {
    id: 'balance',
    title: t(translations.marketMakingPage.table.balance),
    cellRenderer: () => 'N/A',
  },
  {
    id: '',
    title: '',
    cellRenderer: () => (
      <Button text={t('common.deposit')} style={ButtonStyle.primary} />
    ),
    className: 'hidden lg:table-cell',
  },
];
