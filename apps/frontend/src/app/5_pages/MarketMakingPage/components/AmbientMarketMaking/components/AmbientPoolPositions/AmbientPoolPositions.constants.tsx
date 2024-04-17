import React from 'react';

import { t } from 'i18next';

import { TransactionId } from '@sovryn/ui';

import { AmountRenderer } from '../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { translations } from '../../../../../../../locales/i18n';
import { AmbientPosition } from '../../AmbientMarketMaking.types';
import { AmbientLiquidityPool } from '../../utils/AmbientLiquidityPool';
import { AmbientPoolPositionWithdraw } from './components/AmbientPoolPositionWithdraw/AmbientPoolPositionWithdraw';
import { AmbientPositionBalance } from './components/AmbientPositionBalance/AmbientPositionBalance';

export const COLUMNS_CONFIG = (pool: AmbientLiquidityPool) => [
  {
    id: 'positionID',
    title: t(translations.ambientMarketMaking.positionsTable.positionID),
    cellRenderer: (position: AmbientPosition) => (
      <TransactionId href="" value={position.positionId} />
    ),
  },
  {
    id: 'liquidity',
    title: (
      <div className="flex flex-col">
        <span>
          {t(translations.ambientMarketMaking.positionsTable.minPrice)}
        </span>
        <span>
          {t(translations.ambientMarketMaking.positionsTable.maxPrice)}
        </span>
      </div>
    ),
    cellRenderer: (position: AmbientPosition) => (
      <div className="flex flex-col">
        <AmountRenderer value={position.bidTick} suffix="DLLR" />
        <AmountRenderer value={position.askTick} suffix="DLLR" />
      </div>
    ),
  },
  {
    id: 'returns',
    title: t(translations.ambientMarketMaking.positionsTable.returns),
    cellRenderer: (position: AmbientPosition) => (
      <AmountRenderer value={position.aprEst * 100} suffix="%" />
    ),
  },
  {
    id: 'value',
    title: t(translations.ambientMarketMaking.positionsTable.value),
    cellRenderer: () => <AmountRenderer value={'1000'} prefix="$" />,
  },
  {
    id: 'balance',
    title: t(translations.ambientMarketMaking.positionsTable.balance),
    cellRenderer: (position: AmbientPosition) => (
      <AmbientPositionBalance pool={pool} position={position} />
    ),
  },
  {
    id: '',
    title: '',
    cellRenderer: (position: AmbientPosition) => (
      <div className="flex justify-end items-center">
        <AmbientPoolPositionWithdraw pool={pool} position={position} />
      </div>
    ),
  },
];
