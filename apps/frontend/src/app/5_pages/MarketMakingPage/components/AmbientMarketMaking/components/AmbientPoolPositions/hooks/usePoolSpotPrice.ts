import { useCacheCall } from '../../../../../../../../hooks';
import { useCurrentChain } from '../../../../../../../../hooks/useChainStore';
import { useGetPool } from '../../../../../hooks/useGetPool';

export const usePoolSpotPrice = (assetA: string, assetB: string) => {
  const chainId = useCurrentChain();
  const { pool } = useGetPool(assetA, assetB);

  return useCacheCall(
    `pool/${assetA}/${assetB}/spotPrice`,
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
