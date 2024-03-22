import React from 'react';

import { t } from 'i18next';

import { HelperButton } from '@sovryn/ui';

import { AssetPairRenderer } from '../../../../../../2_molecules/AssetPairRenderer/AssetPairRenderer';
import { translations } from '../../../../../../../locales/i18n';
import { AmmLiquidityPool } from '../../../../utils/AmmLiquidityPool';
import { CurrentBalanceRenderer } from '../../../PoolsTable/components/CurrentBalanceRenderer/CurrentBalanceRenderer';
import { PoolsTableAction } from '../../../PoolsTable/components/PoolsTableAction/PoolsTableAction';
import { PoolsTableLiquidity } from '../../../PoolsTable/components/PoolsTableLiquidity/PoolsTableLiquidity';
import { PoolsTableReturns } from '../../../PoolsTable/components/PoolsTableReturns/PoolsTableReturns';
import { PoolsTableTradeVolume } from '../../../PoolsTable/components/PoolsTableTradeVolume/PoolsTableTradeVolume';

export const COLUMNS_CONFIG = [
  {
    id: 'pair',
    title: t(translations.ambientMarketMaking.poolsTable.pair),
    cellRenderer: (pool: AmmLiquidityPool) => (
      <div data-pool-key={pool.key}>
        <AssetPairRenderer asset1={pool.assetA} asset2={pool.assetB} />
      </div>
    ),
    className: 'hidden lg:block',
  },
  {
    id: 'liquidity',
    title: t(translations.ambientMarketMaking.poolsTable.liquidity),
    cellRenderer: (pool: AmmLiquidityPool) => (
      <PoolsTableLiquidity pool={pool} />
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
    cellRenderer: (pool: AmmLiquidityPool) => <PoolsTableReturns pool={pool} />,
    className: 'hidden lg:block',
  },
  {
    id: 'volume',
    title: t(translations.ambientMarketMaking.poolsTable.volume),
    cellRenderer: (pool: AmmLiquidityPool) => (
      <PoolsTableTradeVolume pool={pool} />
    ),
  },
  {
    id: 'balance',
    title: t(translations.ambientMarketMaking.poolsTable.balance),
    cellRenderer: (pool: AmmLiquidityPool) => (
      <div className="flex flex-col gap-1">
        <CurrentBalanceRenderer pool={pool} showLabel={false} />
      </div>
    ),
  },
  {
    id: '',
    title: '',
    cellRenderer: (pool: AmmLiquidityPool) => <PoolsTableAction pool={pool} />,
    className: 'table-cell',
  },
];
