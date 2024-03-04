import React from 'react';

import { t } from 'i18next';

import { HelperButton } from '@sovryn/ui';

import { AssetPairRenderer } from '../../../../2_molecules/AssetPairRenderer/AssetPairRenderer';
import { translations } from '../../../../../locales/i18n';
import { PoolsTableLiquidity } from '../../../MarketMakingPage/components/PoolsTable/components/PoolsTableLiquidity/PoolsTableLiquidity';
import { PoolsTableReturns } from '../../../MarketMakingPage/components/PoolsTable/components/PoolsTableReturns/PoolsTableReturns';
import { PoolsTableTradeVolume } from '../../../MarketMakingPage/components/PoolsTable/components/PoolsTableTradeVolume/PoolsTableTradeVolume';
import { AmmLiquidityPool } from '../../../MarketMakingPage/utils/AmmLiquidityPool';
import { PoolBalance } from './components/PoolBalance/PoolBalance';

export const COLUMNS_CONFIG = [
  {
    id: 'pool',
    title: t(translations.protocolDataPage.marketMaking.pool),
    cellRenderer: (pool: AmmLiquidityPool) => (
      <div data-pool-key={pool.key}>
        <AssetPairRenderer asset1={pool.assetA} asset2={pool.assetB} />
      </div>
    ),
    className: 'hidden lg:block',
  },
  {
    id: 'liquidity',
    title: t(translations.protocolDataPage.marketMaking.liquidity),
    cellRenderer: (pool: AmmLiquidityPool) => (
      <PoolsTableLiquidity pool={pool} />
    ),
  },
  {
    id: 'balance',
    title: t(translations.protocolDataPage.marketMaking.contractBalance),
    cellRenderer: (pool: AmmLiquidityPool) => <PoolBalance pool={pool} />,
  },
  {
    id: 'returns',
    title: (
      <span className="flex items-center gap-1">
        {t(translations.protocolDataPage.marketMaking.returns)}{' '}
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
    title: t(translations.protocolDataPage.marketMaking.volume),
    cellRenderer: (pool: AmmLiquidityPool) => (
      <PoolsTableTradeVolume pool={pool} />
    ),
  },
];

export const DEFAULT_PAGE_SIZE = 8;
