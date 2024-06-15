import React, { FC, useCallback, useMemo } from 'react';

import { MIN_TICK, MAX_TICK, tickToPrice, toDisplayPrice } from '@sovryn/sdex';

import { AmountRenderer } from '../../../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { PoolPositionType } from '../../../../../../MarketMakingPage.types';
import { useGetPoolInfo } from '../../../../../BobDepositModal/hooks/useGetPoolInfo';
import { useGetTokenDecimals } from '../../../../../BobWIthdrawModal/hooks/useGetTokenDecimals';
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
    () =>
      position.positionType === PoolPositionType.ambient ||
      (position.bidTick === MIN_TICK && position.askTick === MAX_TICK),
    [position],
  );

  const { poolTokens } = useGetPoolInfo(pool.base, pool.quote);
  const { baseTokenDecimals, quoteTokenDecimals } = useGetTokenDecimals(
    poolTokens?.tokenA,
    poolTokens?.tokenB,
  );

  const renderAmountRenderer = useCallback(
    (tick: number) => (
      <AmountRenderer
        value={toDisplayPrice(
          tickToPrice(tick),
          baseTokenDecimals,
          quoteTokenDecimals,
          true,
        )}
        suffix={pool.quote}
      />
    ),
    [baseTokenDecimals, quoteTokenDecimals, pool.quote],
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
