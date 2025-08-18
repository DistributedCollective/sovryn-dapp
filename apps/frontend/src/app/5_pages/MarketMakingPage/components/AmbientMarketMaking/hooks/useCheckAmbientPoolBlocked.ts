import { useMemo } from 'react';

import { Pool } from '@sovryn/sdk';

import { BLOCKED_AMBIENT_POOLS } from '../AmbientMarketMaking.constants';

export type AmbientPoolBlockInfo = {
  isBlocked: boolean;
  message?: string;
};

export const useCheckAmbientPoolBlocked = (
  pool: Pool,
): AmbientPoolBlockInfo => {
  return useMemo(() => {
    const blockedPool = BLOCKED_AMBIENT_POOLS.find(
      blockedPool =>
        (blockedPool.poolAssetA === pool.base.symbol &&
          blockedPool.poolAssetB === pool.quote.symbol) ||
        (blockedPool.poolAssetA === pool.quote.symbol &&
          blockedPool.poolAssetB === pool.base.symbol),
    );

    return {
      isBlocked: !!blockedPool,
      message: blockedPool?.message,
    };
  }, [pool.base.symbol, pool.quote.symbol]);
};
