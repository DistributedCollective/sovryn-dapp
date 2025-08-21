import React from 'react';

import { t } from 'i18next';

import { ChainIds } from '@sovryn/ethers-provider';
import { HelperButton } from '@sovryn/ui';

import { AssetPairRenderer } from '../../../../2_molecules/AssetPairRenderer/AssetPairRenderer';
import { translations } from '../../../../../locales/i18n';
import { AmmLiquidityPool } from '../../utils/AmmLiquidityPool';
import { BlockedPoolConfig } from './PoolsTable.types';
import { CurrentBalanceRenderer } from './components/CurrentBalanceRenderer/CurrentBalanceRenderer';
import { PoolsTableAction } from './components/PoolsTableAction/PoolsTableAction';
import { PoolsTableLiquidity } from './components/PoolsTableLiquidity/PoolsTableLiquidity';
import { PoolsTableReturns } from './components/PoolsTableReturns/PoolsTableReturns';
import { PoolsTableTradeVolume } from './components/PoolsTableTradeVolume/PoolsTableTradeVolume';

export const COLUMNS_CONFIG = [
  {
    id: 'pair',
    title: t(translations.marketMakingPage.poolsTable.pair),
    cellRenderer: (pool: AmmLiquidityPool) => (
      <div data-pool-key={pool.key}>
        <AssetPairRenderer asset1={pool.assetA} asset2={pool.assetB} />
      </div>
    ),
    className: 'hidden lg:block',
  },
  {
    id: 'liquidity',
    title: t(translations.marketMakingPage.poolsTable.liquidity),
    cellRenderer: (pool: AmmLiquidityPool) => (
      <PoolsTableLiquidity pool={pool} />
    ),
  },
  {
    id: 'returns',
    title: (
      <span className="flex items-center gap-1">
        {t(translations.marketMakingPage.poolsTable.returnsRate)}{' '}
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
    cellRenderer: (pool: AmmLiquidityPool) => (
      <PoolsTableTradeVolume pool={pool} />
    ),
  },
  {
    id: 'balance',
    title: t(translations.marketMakingPage.poolsTable.balance),
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

// Configuration for pools that have deposits locked.
export const BLOCKED_POOLS: BlockedPoolConfig[] = [
  {
    poolAssetA: 'MYNT',
    poolAssetB: 'BTC',
    chainId: ChainIds.RSK_MAINNET,
    message: t(
      translations.marketMakingPage.marketMakingOperations.depositNotAllowed,
    ),
  },
  {
    poolAssetA: 'SOV',
    poolAssetB: 'BTC',
    chainId: ChainIds.RSK_TESTNET,
    message: 'SOV pool deposits are under maintenance for testing purposes',
  },
];
