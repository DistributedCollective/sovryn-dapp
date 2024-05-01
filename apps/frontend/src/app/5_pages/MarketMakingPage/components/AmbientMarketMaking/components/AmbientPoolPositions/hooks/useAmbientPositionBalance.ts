import { useMemo } from 'react';

import { AmbientPosition } from '../../../AmbientMarketMaking.types';
import { AmbientLiquidityPool } from '../../../utils/AmbientLiquidityPool';
import { getPositionBalance } from '../AmbientPoolPositions.utils';
import { usePoolSpotPrice } from './usePoolSpotPrice';

export const useAmbientPositionBalance = (
  pool: AmbientLiquidityPool,
  position: AmbientPosition,
) => {
  const { value: price } = usePoolSpotPrice(pool.base, pool.quote);

  return useMemo(() => getPositionBalance(position, price), [position, price]);
};
