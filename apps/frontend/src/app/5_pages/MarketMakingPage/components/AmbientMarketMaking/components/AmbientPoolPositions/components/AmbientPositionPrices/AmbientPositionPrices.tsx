import React, { FC, useMemo } from 'react';

import { tickToPrice } from '@sovryn/sdex';

import { AmountRenderer } from '../../../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { AmbientPosition } from '../../../../AmbientMarketMaking.types';
import { AmbientLiquidityPool } from '../../../../utils/AmbientLiquidityPool';

type AmbientPositionPricesProps = {
  pool: AmbientLiquidityPool;
  position: AmbientPosition;
};

export const AmbientPositionPrices: FC<AmbientPositionPricesProps> = ({
  position,
  pool,
}) => {
  const isAmbient = useMemo(
    () => position.positionType === 'ambient',
    [position.positionType],
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
      <AmountRenderer
        value={tickToPrice(position.bidTick)}
        suffix={pool.quote}
      />
      <AmountRenderer
        value={tickToPrice(position.askTick)}
        suffix={pool.quote}
      />
    </div>
  );
};
