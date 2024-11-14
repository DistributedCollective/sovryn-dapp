import { Pool } from '@sovryn/sdk';

import { useCacheCall } from '../../../../../../../../hooks';
import { useCurrentChain } from '../../../../../../../../hooks/useChainStore';
import { useGetPool } from '../../../../../hooks/useGetPool';

export const usePoolSpotPrice = (p: Pool) => {
  const chainId = useCurrentChain();
  const { pool } = useGetPool(p);

  return useCacheCall(
    `pool/${p.base.address}/${p.quote.address}/spotPrice`,
    chainId,
    async () => {
      if (!pool) {
        return;
      }

      return await pool.spotPrice();
    },
    [pool],
    0,
  );
};
