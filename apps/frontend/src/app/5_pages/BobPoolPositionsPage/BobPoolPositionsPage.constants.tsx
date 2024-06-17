import React from 'react';

import { prettyTx } from '@sovryn/ui';

import { AmountRenderer } from '../../2_molecules/AmountRenderer/AmountRenderer';
import { decimalic } from '../../../utils/math';
import { AmbientLiquidityPool } from '../MarketMakingPage/components/AmbientMarketMaking/utils/AmbientLiquidityPool';
import { Position } from './BobPoolPositionsPage.types';

export const COLUMNS_CONFIG = (pool: AmbientLiquidityPool) => [
  {
    id: 'id',
    title: 'Id',
    cellRenderer: (position: Position) => (
      <div>{prettyTx(position.positionId, 4, 4)}</div>
    ),
  },
  {
    id: 'min',
    title: 'Min price',
    cellRenderer: (position: Position) => (
      <div>
        {position.minPriceBase} {pool.quote}
      </div>
    ),
  },
  {
    id: 'max',
    title: 'Max price',
    cellRenderer: (position: Position) => (
      <div>
        {position.maxPriceBase} {pool.quote}
      </div>
    ),
  },
  {
    id: 'liqBase',
    title: 'Liquidity (base)',
    cellRenderer: (position: Position) => (
      <AmountRenderer
        value={decimalic(position.positionLiqBase).toUnits(
          position.baseTokenDecimals,
        )}
        suffix={pool.base}
      />
    ),
  },
  {
    id: 'liqQuote',
    title: 'Liquidity (quote)',
    cellRenderer: (position: Position) => (
      <AmountRenderer
        value={decimalic(position.positionLiqQuote).toUnits(
          position.quoteTokenDecimals,
        )}
        suffix={pool.quote}
      />
    ),
  },
];
