import React from 'react';

import classNames from 'classnames';
import { t } from 'i18next';

import { ChainIds } from '@sovryn/ethers-provider';
import { HelperButton } from '@sovryn/ui';

import { AssetPairRenderer } from '../../../../2_molecules/AssetPairRenderer/AssetPairRenderer';
import { DeprecatedBadge } from '../../../../2_molecules/DeprecatedBadge/DeprecatedBadge';
import { RusdtMigrationNotice } from '../../../../2_molecules/RusdtMigrationNotice/RusdtMigrationNotice';
import { getRskDeprecatedAssetTooltips } from '../../../../../constants/tokens';
import { translations } from '../../../../../locales/i18n';
import { COMMON_SYMBOLS, findAsset } from '../../../../../utils/asset';
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
    cellRenderer: (pool: AmmLiquidityPool) => {
      const isDeprecated =
        !!getRskDeprecatedAssetTooltips(pool.assetA) ||
        !!getRskDeprecatedAssetTooltips(pool.assetB);
      const isRusdtPool = [pool.assetA, pool.assetB].some(
        asset => asset.toUpperCase() === COMMON_SYMBOLS.RUSDT,
      );
      return (
        <div
          data-pool-key={pool.key}
          className="inline-flex items-center gap-2"
        >
          <AssetPairRenderer
            asset1={pool.assetA}
            asset2={pool.assetB}
            chainId={pool.chainId}
            hideSymbol
          />
          <div
            className={classNames('flex flex-col gap-1 font-medium text-xs', {
              'text-gray-40': isDeprecated,
            })}
          >
            <span>
              {findAsset(pool.assetA, pool.chainId)?.symbol}/
              {findAsset(pool.assetB, pool.chainId)?.symbol}
            </span>
            <span className="flex flex-row justify-start items-center gap-1">
              {isDeprecated && <DeprecatedBadge />}
              {isRusdtPool && (
                <RusdtMigrationNotice
                  className="justify-center lg:justify-end text-center lg:text-right"
                  buttonClassName="prevent-row-click"
                  dataAttributePrefix="market-making-rusdt-migration"
                />
              )}
            </span>
          </div>
        </div>
      );
    },
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
  {
    poolAssetA: 'POWA',
    poolAssetB: 'BTC',
    chainId: ChainIds.RSK_MAINNET,
    message: t(
      translations.marketMakingPage.marketMakingOperations.depositNotAllowed,
    ),
  },
];
