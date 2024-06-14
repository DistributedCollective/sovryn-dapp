import React from 'react';

import { prettyTx } from '@sovryn/ui';

import { AmountRenderer } from '../../2_molecules/AmountRenderer/AmountRenderer';
import { decimalic } from '../../../utils/math';
import { Position } from './BobPoolPositionsPage.types';

export const COLUMNS_CONFIG = [
  {
    id: 'id',
    title: 'Id',
    cellRenderer: (position: Position) => (
      <div>{prettyTx(position.positionId, 4, 4)}</div>
    ),
  },
  {
    id: 'min',
    title: 'Min',
    cellRenderer: (position: Position) => <div>{position.minPriceBase}</div>,
  },
  {
    id: 'max',
    title: 'Max',
    cellRenderer: (position: Position) => <div>{position.maxPriceBase}</div>,
  },
  {
    id: 'liqBase',
    title: 'Liquidity in base',
    cellRenderer: (position: Position) => (
      <AmountRenderer
        value={decimalic(position.positionLiqBase).toUnits(
          position.baseTokenDecimals,
        )}
      />
    ),
  },
  {
    id: 'liqQuote',
    title: 'Liquidity in quote',
    cellRenderer: (position: Position) => (
      <AmountRenderer
        value={decimalic(position.positionLiqQuote).toUnits(
          position.quoteTokenDecimals,
        )}
      />
    ),
  },
];
