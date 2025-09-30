import React from 'react';

import classNames from 'classnames';
import { t } from 'i18next';

import { numberToChainId } from '@sovryn/ethers-provider';
import { Pool } from '@sovryn/sdk';
import { HelperButton } from '@sovryn/ui';

import { AmountRenderer } from '../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { AssetPairRenderer } from '../../../../../../2_molecules/AssetPairRenderer/AssetPairRenderer';
import { DeprecatedBadge } from '../../../../../../2_molecules/DeprecatedBadge/DeprecatedBadge';
import { getBobDeprecatedAssetTooltips } from '../../../../../../../constants/tokens';
import { translations } from '../../../../../../../locales/i18n';
import { findAsset } from '../../../../../../../utils/asset';
import { decimalic } from '../../../../../../../utils/math';
import { AmbientPool24Volume } from './components/AmbientPool24Volume/AmbientPool24Volume';
import { AmbientPoolDeposit } from './components/AmbientPoolDeposit/AmbientPoolDeposit';
import { AmbientPoolFeeRate } from './components/AmbientPoolFeeRate/AmbientPoolFeeRate';
import { AmbientPoolLiquidity } from './components/AmbientPoolLiquidity/AmbientPoolLiquidity';
import { AmbientPoolTotalBalance } from './components/AmbientPoolTotalBalance/AmbientPoolTotalBalance';

export const COLUMNS_CONFIG = [
  {
    id: 'pair',
    title: t(translations.ambientMarketMaking.poolsTable.pair),
    cellRenderer: (pool: Pool) => {
      const chainId = numberToChainId(pool.chainId);
      const isDeprecated =
        !!getBobDeprecatedAssetTooltips(pool.base.symbol) ||
        !!getBobDeprecatedAssetTooltips(pool.quote.symbol);

      return (
        <div
          className="inline-flex items-center gap-2"
          data-pool-key={pool.identifier}
        >
          <AssetPairRenderer
            asset1={pool.base.symbol}
            asset2={pool.quote.symbol}
            chainId={chainId}
            hideSymbol
          />
          <div
            className={classNames('flex flex-col gap-1 font-medium text-xs', {
              'text-gray-40': isDeprecated,
            })}
          >
            <span>
              {findAsset(pool.base.symbol, chainId)?.symbol}/
              {findAsset(pool.quote.symbol, chainId)?.symbol}
            </span>
            {isDeprecated && <DeprecatedBadge />}
          </div>
        </div>
      );
    },
  },
  {
    id: 'liquidity',
    title: t(translations.ambientMarketMaking.poolsTable.liquidity),
    cellRenderer: (pool: Pool) => <AmbientPoolLiquidity pool={pool} />,
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
    cellRenderer: (pool: Pool) => <AmbientPoolFeeRate pool={pool} />,
  },
  {
    id: 'volume',
    title: t(translations.ambientMarketMaking.poolsTable.volume),
    cellRenderer: (pool: Pool) => <AmbientPool24Volume pool={pool} />,
  },
  {
    id: 'lastPrice',
    title: t(translations.ambientMarketMaking.poolsTable.lastPrice),
    cellRenderer: (pool: Pool) => (
      <AmountRenderer
        value={decimalic(pool.price)}
        suffix={pool.quote.symbol}
      />
    ),
  },
  {
    id: 'balance',
    title: t(translations.ambientMarketMaking.poolsTable.balance),
    cellRenderer: (pool: Pool) => <AmbientPoolTotalBalance pool={pool} />,
  },
  {
    id: '',
    title: '',
    cellRenderer: (pool: Pool) => <AmbientPoolDeposit pool={pool} />,
    className: 'table-cell',
  },
];
