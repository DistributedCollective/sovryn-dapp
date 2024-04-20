import React, { FC } from 'react';

import { tickToPrice } from '@sovryn/sdex';

import { AmountRenderer } from '../../../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { INFINITE } from '../../../../../BobDepositModal/components/PriceRange/components/BalancedRange/BalancedRange.constants';
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
  if (position.positionType === 'ambient') {
    return <div>{INFINITE}</div>;
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
