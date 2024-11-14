import React, { FC, useCallback, useMemo } from 'react';

import { MIN_TICK, MAX_TICK, tickToPrice, toDisplayPrice } from '@sovryn/sdex';
import { Pool } from '@sovryn/sdk';

import { AmountRenderer } from '../../../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { PoolPositionType } from '../../../../../../MarketMakingPage.types';
import { AmbientPosition } from '../../../../AmbientMarketMaking.types';

type AmbientPositionPricesProps = {
  pool: Pool;
  position: AmbientPosition;
};

export const AmbientPositionPrices: FC<AmbientPositionPricesProps> = ({
  position,
  pool,
}) => {
  const isAmbient = useMemo(
    () =>
      position.positionType === PoolPositionType.ambient ||
      (position.bidTick === MIN_TICK && position.askTick === MAX_TICK),
    [position],
  );

  const renderAmountRenderer = useCallback(
    (tick: number) => (
      <AmountRenderer
        value={toDisplayPrice(
          tickToPrice(tick),
          pool.base.decimals,
          pool.quote.decimals,
          true,
        )}
        suffix={pool.quote.symbol}
      />
    ),
    [pool.base.decimals, pool.quote.decimals, pool.quote.symbol],
  );

  if (isAmbient) {
    return (
      <>
        <div className="text-xs font-medium">0</div>
        <div className="text-xs font-medium">∞</div>
      </>
    );
  }

  return (
    <div className="inline-flex flex-col">
      {renderAmountRenderer(position.askTick)}
      {renderAmountRenderer(position.bidTick)}
    </div>
  );
};
