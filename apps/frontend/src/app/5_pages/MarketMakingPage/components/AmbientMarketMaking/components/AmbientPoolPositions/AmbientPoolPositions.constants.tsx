import React from 'react';

import { t } from 'i18next';

import { AmountRenderer } from '../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { TransactionIdRenderer } from '../../../../../../2_molecules/TransactionIdRenderer/TransactionIdRenderer';
import { translations } from '../../../../../../../locales/i18n';
import { AmbientPosition } from '../../AmbientMarketMaking.types';
import { AmbientLiquidityPool } from '../../utils/AmbientLiquidityPool';
import { AmbientPoolPositionClaimFees } from './components/AmbientPoolPositionClaimFees/AmbientPoolPositionClaimFees';
import { AmbientPoolPositionWithdraw } from './components/AmbientPoolPositionWithdraw/AmbientPoolPositionWithdraw';
import { AmbientPositionBalance } from './components/AmbientPositionBalance/AmbientPositionBalance';
import { AmbientPositionPrices } from './components/AmbientPositionPrices/AmbientPositionPrices';
import { AmbientPositionValue } from './components/AmbientPositionValue/AmbientPositionValue';

export const COLUMNS_CONFIG = (pool: AmbientLiquidityPool) => [
  {
    id: 'positionID',
    title: t(translations.ambientMarketMaking.positionsTable.positionID),
    cellRenderer: (position: AmbientPosition) => (
      <TransactionIdRenderer
        hash={position.firstMintTx}
        chainId={pool.chainId}
      />
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
      <AmbientPositionPrices pool={pool} position={position} />
    ),
  },
  {
    id: 'returns',
    title: t(translations.ambientMarketMaking.positionsTable.apr),
    cellRenderer: (position: AmbientPosition) => (
      <AmountRenderer value={position.aprEst * 100} suffix="%" />
    ),
  },
  {
    id: 'value',
    title: t(translations.ambientMarketMaking.positionsTable.value),
    cellRenderer: (position: AmbientPosition) => (
      <AmbientPositionValue pool={pool} position={position} />
    ),
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
    className: 'max-w-64',
    cellRenderer: (position: AmbientPosition) => (
      <div className="flex justify-end items-center">
        {position.rewardLiq > 0 && (
          <AmbientPoolPositionClaimFees
            pool={pool}
            position={position}
            className="mr-4"
          />
        )}
        <AmbientPoolPositionWithdraw pool={pool} position={position} />
      </div>
    ),
  },
];
