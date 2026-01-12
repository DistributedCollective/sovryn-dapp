import { useMemo } from 'react';

import { fromDisplayPrice } from '@sovryn/sdex';
import { Pool } from '@sovryn/sdk';

import { AmbientPosition } from '../../../AmbientMarketMaking.types';
import { getPositionBalance } from '../AmbientPoolPositions.utils';

export const useAmbientPositionBalance = (
  pool: Pool,
  position: AmbientPosition,
  priceOverride?: number,
) => {
  const price = fromDisplayPrice(
    Number(priceOverride ?? pool.price),
    pool.base.decimals,
    pool.quote.decimals,
    true,
  );

  return useMemo(() => getPositionBalance(position, price), [position, price]);
};
