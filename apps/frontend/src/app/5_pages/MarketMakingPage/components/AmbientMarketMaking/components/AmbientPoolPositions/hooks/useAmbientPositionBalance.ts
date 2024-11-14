import { useMemo } from 'react';

import { Pool } from '@sovryn/sdk';

import { AmbientPosition } from '../../../AmbientMarketMaking.types';
import { getPositionBalance } from '../AmbientPoolPositions.utils';
import { usePoolSpotPrice } from './usePoolSpotPrice';

export const useAmbientPositionBalance = (
  pool: Pool,
  position: AmbientPosition,
) => {
  const { value: price } = usePoolSpotPrice(pool);
  return useMemo(() => getPositionBalance(position, price), [position, price]);
};
