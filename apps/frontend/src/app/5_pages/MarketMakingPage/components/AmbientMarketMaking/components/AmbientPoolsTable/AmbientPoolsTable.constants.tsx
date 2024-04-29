import React from 'react';

import { t } from 'i18next';

import { HelperButton } from '@sovryn/ui';

import { AssetPairRenderer } from '../../../../../../2_molecules/AssetPairRenderer/AssetPairRenderer';
import { translations } from '../../../../../../../locales/i18n';
import { AmbientLiquidityPool } from '../../utils/AmbientLiquidityPool';
import { AmbientPool24Volume } from './components/AmbientPool24Volume/AmbientPool24Volume';
import { AmbientPoolDeposit } from './components/AmbientPoolDeposit/AmbientPoolDeposit';
import { AmbientPoolFeeRate } from './components/AmbientPoolFeeRate/AmbientPoolFeeRate';
import { AmbientPoolLiquidity } from './components/AmbientPoolLiquidity/AmbientPoolLiquidity';
import { AmbientPoolTotalBalance } from './components/AmbientPoolTotalBalance/AmbientPoolTotalBalance';

export const COLUMNS_CONFIG = [
  {
    id: 'pair',
    title: t(translations.ambientMarketMaking.poolsTable.pair),
    cellRenderer: (pool: AmbientLiquidityPool) => (
      <div className="inline-flex" data-pool-key={pool.key}>
        <AssetPairRenderer
          asset1={pool.quote}
          asset2={pool.base}
          chainId={pool.chainId}
        />
      </div>
    ),
  },
  {
    id: 'liquidity',
    title: t(translations.ambientMarketMaking.poolsTable.liquidity),
    cellRenderer: (pool: AmbientLiquidityPool) => (
      <AmbientPoolLiquidity pool={pool} />
    ),
  },
  {
    id: 'lpFeeRate',
    title: (
      <span className="flex items-center gap-1">
        {t(translations.ambientMarketMaking.poolsTable.lpFeeRate)}{' '}
        <HelperButton
          content={t(translations.ambientMarketMaking.poolsTable.lpFeeRateInfo)}
        />
      </span>
    ),
    cellRenderer: (pool: AmbientLiquidityPool) => (
      <AmbientPoolFeeRate pool={pool} />
    ),
  },
  {
    id: 'volume',
    title: t(translations.ambientMarketMaking.poolsTable.volume),
    cellRenderer: (pool: AmbientLiquidityPool) => (
      <AmbientPool24Volume pool={pool} />
    ),
  },
  {
    id: 'balance',
    title: t(translations.ambientMarketMaking.poolsTable.balance),
    cellRenderer: (pool: AmbientLiquidityPool) => (
      <AmbientPoolTotalBalance pool={pool} />
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
