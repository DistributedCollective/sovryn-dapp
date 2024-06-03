import { useMemo } from 'react';

import { useGetPoolInfo } from '../../../../BobDepositModal/hooks/useGetPoolInfo';
import { AmbientPosition } from '../../../AmbientMarketMaking.types';
import { AmbientLiquidityPool } from '../../../utils/AmbientLiquidityPool';

export const usePositionStatus = (
  pool: AmbientLiquidityPool,
  position: AmbientPosition,
) => {
  const { spotPrice: currentPrice } = useGetPoolInfo(pool.base, pool.quote);

  const rangeSpanAboveCurrentPrice = useMemo(
    () => position.askTick - currentPrice,
    [currentPrice, position.askTick],
  );

  const rangeSpanBelowCurrentPrice = useMemo(
    () => currentPrice - position.bidTick,
    [currentPrice, position.bidTick],
  );

  return useMemo(
    () => rangeSpanAboveCurrentPrice < 0 || rangeSpanBelowCurrentPrice < 0,
    [rangeSpanAboveCurrentPrice, rangeSpanBelowCurrentPrice],
  );
};
