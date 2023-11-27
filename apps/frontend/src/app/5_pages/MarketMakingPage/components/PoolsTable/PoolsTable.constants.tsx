import React from 'react';

import { t } from 'i18next';

import { HelperButton } from '@sovryn/ui';

import { AssetPairRenderer } from '../../../../2_molecules/AssetPairRenderer/AssetPairRenderer';
import { translations } from '../../../../../locales/i18n';
import { AmmLiquidityPool } from '../../utils/AmmLiquidityPool';
import { PoolsTableAction } from './components/PoolsTableAction/PoolsTableAction';
import { PoolsTableReturns } from './components/PoolsTableReturns/PoolsTableReturns';

export const COLUMNS_CONFIG = [
  {
    id: 'pair',
    title: t(translations.marketMakingPage.poolsTable.pair),
    cellRenderer: (pool: AmmLiquidityPool) => (
      <AssetPairRenderer asset1={pool.assetA} asset2={pool.assetB} />
    ),
  },
  {
    id: 'liquidity',
    title: t(translations.marketMakingPage.poolsTable.liquidity),
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
        {t(translations.marketMakingPage.poolsTable.returns)}{' '}
        <HelperButton
          content={t(translations.marketMakingPage.poolsTable.returnsInfo)}
        />
      </span>
    ),
    cellRenderer: (pool: AmmLiquidityPool) => <PoolsTableReturns pool={pool} />,
    className: 'hidden lg:block',
  },
  {
    id: 'volume',
    title: t(translations.marketMakingPage.poolsTable.volume),
    cellRenderer: () => '10',
  },
  {
    id: 'balance',
    title: t(translations.marketMakingPage.poolsTable.balance),
    cellRenderer: () => 'N/A',
  },
  {
    id: '',
    title: '',
    cellRenderer: (pool: AmmLiquidityPool) => <PoolsTableAction pool={pool} />,
    className: 'table-cell',
  },
];
