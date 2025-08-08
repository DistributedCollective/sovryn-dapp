import { useMemo } from 'react';

import { BLOCKED_POOLS } from '../components/PoolsTable/PoolsTable.constants';
import { AmmLiquidityPool } from '../utils/AmmLiquidityPool';

export type PoolBlockInfo = {
  isBlocked: boolean;
  message?: string;
};

export const useCheckPoolBlocked = (pool: AmmLiquidityPool): PoolBlockInfo => {
  const blockedPool = useMemo(
    () =>
      BLOCKED_POOLS.find(
        blockedPool =>
          blockedPool.poolAssetA === pool.assetA &&
          blockedPool.chainId === pool.chainId,
      ),
    [pool.assetA, pool.chainId],
  );

  return {
    isBlocked: !!blockedPool,
    message: blockedPool?.message,
  };
};
