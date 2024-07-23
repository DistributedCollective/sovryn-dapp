import React from 'react';

import { t } from 'i18next';

import { HelperButton } from '@sovryn/ui';

import { AmountRenderer } from '../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { TransactionIdRenderer } from '../../../../../../2_molecules/TransactionIdRenderer/TransactionIdRenderer';
import { translations } from '../../../../../../../locales/i18n';
import { AmbientPosition } from '../../AmbientMarketMaking.types';
import { AmbientLiquidityPool } from '../../utils/AmbientLiquidityPool';
import { AmbientPoolPositionClaimFees } from './components/AmbientPoolPositionClaimFees/AmbientPoolPositionClaimFees';
import { AmbientPoolPositionWithdraw } from './components/AmbientPoolPositionWithdraw/AmbientPoolPositionWithdraw';
import { AmbientPoolReposition } from './components/AmbientPoolReposition/AmbientPoolReposition';
import { AmbientPositionBalance } from './components/AmbientPositionBalance/AmbientPositionBalance';
import { AmbientPositionPrices } from './components/AmbientPositionPrices/AmbientPositionPrices';
import { AmbientPositionStatus } from './components/AmbientPositionStatus/AmbientPositionStatus';
import { AmbientPositionValue } from './components/AmbientPositionValue/AmbientPositionValue';

export const COLUMNS_CONFIG = (pool: AmbientLiquidityPool) => [
  {
    id: 'positionID',
    title: t(translations.ambientMarketMaking.positionsTable.positionID),
    cellRenderer: (position: AmbientPosition) => (
      <TransactionIdRenderer
        hash={position.transactionHash}
        chainId={pool.chainId}
      />
    ),
  },
  {
    id: 'prices',
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
    title: (
      <span className="flex items-center gap-1">
        {t(translations.ambientMarketMaking.positionsTable.apr)}{' '}
        <HelperButton
          content={t(translations.ambientMarketMaking.positionsTable.aprInfo)}
        />
      </span>
    ),
    cellRenderer: (position: AmbientPosition) => (
      <AmountRenderer value={Number(position.aprEst) * 100} suffix="%" />
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
    id: 'status',
    title: t(translations.ambientMarketMaking.positionsTable.status.title),
    cellRenderer: (position: AmbientPosition) => (
      <AmbientPositionStatus position={position} pool={pool} />
    ),
  },
  {
    id: '',
    title: '',
    cellRenderer: (position: AmbientPosition) => (
      <div className="flex justify-end items-center">
        {Number(position.rewardLiq) > 0 && (
          <AmbientPoolPositionClaimFees
            pool={pool}
            position={position}
            className="mr-4"
          />
        )}
        <AmbientPoolReposition
          pool={pool}
          position={position}
          className="mr-4"
        />
        <AmbientPoolPositionWithdraw pool={pool} position={position} />
      </div>
    ),
  },
];
