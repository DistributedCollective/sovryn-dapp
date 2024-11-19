import { Pool } from '@sovryn/sdk';

import { useCacheCall } from '../../../../../../../../hooks';
import { useCurrentChain } from '../../../../../../../../hooks/useChainStore';
import { useGetPool } from '../../../../../hooks/useGetPool';

export const usePoolSpotPrice = (pool: Pool) => {
  const chainId = useCurrentChain();
  const { pool: crocPool } = useGetPool(pool);

  return useCacheCall(
    `pool/${pool.base.address}/${pool.quote.address}/spotPrice`,
    chainId,
    async () => {
      if (!crocPool) {
        return;
      }

      return await crocPool.spotPrice();
    },
    [crocPool],
    0,
  );
};
