import React from 'react';

import { t } from 'i18next';

import { BOB_CHAIN_ID } from '../../../../../config/chains';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { AssetPairRenderer } from '../../../../2_molecules/AssetPairRenderer/AssetPairRenderer';
import { TOKEN_RENDER_PRECISION } from '../../../../../constants/currencies';
import { translations } from '../../../../../locales/i18n';
import { fromWei } from '../../../../../utils/math';
import { LiquidityBookPool } from '../../LiquidityBookPage.types';
import { LiquidityBookFrameAction } from './components/LiquidityBookFrameAction/LiquidityBookFrameAction';
import { LiquidityBookBalance } from './components/LiquidityBookFrameBalance/LiquidityBookFrameBalance';
import { getPriceFromId } from '../../utils/bins';

export const COLUMNS_CONFIG = [
  {
    id: 'pair',
    title: t(translations.liquidityBookPage.table.pair),
    cellRenderer: (pool: LiquidityBookPool) => (
      <AssetPairRenderer
        asset1={String(pool.pair[0].symbol)}
        asset2={String(pool.pair[1].symbol)}
        chainId={BOB_CHAIN_ID}
      />
    ),
  },
  {
    id: 'liquidity',
    title: t(translations.liquidityBookPage.table.liquidity),
    cellRenderer: (pool: LiquidityBookPool) => (
      <div>
        <AmountRenderer
          suffix={pool.pair[0].symbol}
          precision={TOKEN_RENDER_PRECISION}
          value={fromWei(pool.liquidity[0], pool.pair[0].decimals)}
        />{' '}
        /{' '}
        <AmountRenderer
          suffix={pool.pair[1].symbol}
          precision={TOKEN_RENDER_PRECISION}
          value={fromWei(pool.liquidity[1], pool.pair[1].decimals)}
        />
      </div>
    ),
  },
  {
    id: 'balance',
    title: t(translations.liquidityBookPage.table.balance),
    cellRenderer: (pool: LiquidityBookPool) => (
      <LiquidityBookBalance pool={pool} />
    ),
  },
  {
    id: 'etc',
    title: t(translations.liquidityBookPage.table.balance),
    cellRenderer: (pool: LiquidityBookPool) => (
      <>
        {pool.activeBinId} | {pool.binStep} |{' '}
        {getPriceFromId(pool.activeBinId, pool.binStep)}
      </>
    ),
  },
  {
    id: '',
    title: '',
    cellRenderer: (pool: LiquidityBookPool) => (
      <LiquidityBookFrameAction pool={pool} />
    ),
  },
];
