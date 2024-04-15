import React from 'react';

import { t } from 'i18next';

import { HelperButton } from '@sovryn/ui';

import { AssetPairRenderer } from '../../../../../../2_molecules/AssetPairRenderer/AssetPairRenderer';
import { translations } from '../../../../../../../locales/i18n';
import { AmbientLiquidityPool } from '../../utils/AmbientLiquidityPool';
import { AmbientPool24Volume } from './components/AmbientPool24Volume/AmbientPool24Volume';
import { AmbientPoolDeposit } from './components/AmbientPoolDeposit/AmbientPoolDeposit';
import { AmbientPoolLiquidity } from './components/AmbientPoolLiquidity/AmbientPoolLiquidity';

export const COLUMNS_CONFIG = [
  {
    id: 'pair',
    title: t(translations.ambientMarketMaking.poolsTable.pair),
    cellRenderer: (pool: AmbientLiquidityPool) => (
      <div data-pool-key={pool.key}>
        <AssetPairRenderer
          asset1={pool.base}
          asset2={pool.quote}
          chainId={pool.chainId}
        />
      </div>
    ),
    className: 'hidden lg:block',
  },
  {
    id: 'liquidity',
    title: t(translations.ambientMarketMaking.poolsTable.liquidity),
    cellRenderer: (pool: AmbientLiquidityPool) => (
      <AmbientPoolLiquidity pool={pool} />
    ),
  },
  {
    id: 'returns',
    title: (
      <span className="flex items-center gap-1">
        {t(translations.ambientMarketMaking.poolsTable.returns)}{' '}
        <HelperButton
          content={t(translations.ambientMarketMaking.poolsTable.returnsInfo)}
        />
      </span>
    ),
    cellRenderer: (pool: AmbientLiquidityPool) => (
      <AmbientPool24Volume pool={pool} />
    ),
    className: 'hidden lg:block',
  },
  {
    id: 'volume',
    title: t(translations.ambientMarketMaking.poolsTable.volume),
    cellRenderer: (pool: AmbientLiquidityPool) => null,
  },
  {
    id: 'balance',
    title: t(translations.ambientMarketMaking.poolsTable.balance),
    cellRenderer: (pool: AmbientLiquidityPool) => (
      <div className="flex flex-col gap-1"></div>
    ),
  },
  {
    id: '',
    title: '',
    cellRenderer: (pool: AmbientLiquidityPool) => (
      <AmbientPoolDeposit pool={pool} />
    ),
    className: 'table-cell',
  },
];
