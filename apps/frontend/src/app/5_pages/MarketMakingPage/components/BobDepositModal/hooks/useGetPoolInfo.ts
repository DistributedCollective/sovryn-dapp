import { useCallback } from 'react';

import { Pool } from '@sovryn/sdk';

import { useCurrentChain } from '../../../../../../hooks/useChainStore';
import { getIndexerUri } from '../../../../../../utils/indexer';
import { useGetPool } from '../../../hooks/useGetPool';
import { useQuery } from '@tanstack/react-query';

export const useGetPoolInfo = (pool: Pool) => {
  const chainId = useCurrentChain();
  const { pool: crocPool, poolTokens } = useGetPool(pool);

  const getLiquidityFee = useCallback(async () => {
    if (!crocPool || !poolTokens) {
      return '0';
    }

    const poolStatsFreshEndpoint = getIndexerUri(chainId) + '/pool_stats?';

    return fetch(
      poolStatsFreshEndpoint +
        new URLSearchParams({
          base: poolTokens.tokenA.tokenAddr,
          quote: poolTokens.tokenB.tokenAddr,
          poolIdx: poolTokens.poolIndex.toString(),
          chainId: chainId,
        }),
    )
      .then(response => response?.json())
      .then(json => {
        if (!json?.data) {
          return '0';
        }
        const payload = json.data;
        return (payload.feeRate * 100).toString();
      })
      .catch(error => {
        return '0';
      });
  }, [chainId, crocPool, poolTokens]);

  const { data = { price: 0, spotPrice: 0, feeRate: '0' }, isPending } =
    useQuery({
      queryKey: ['useGetPoolInfo', { pool }],
      // queryFn: () => Promise.all([getPoolPrice(), getSpotPrice(), getLiquidityFee()]),
      queryFn: async () => {
        if (!crocPool) {
          return;
        }

        const price = await crocPool
          ?.displayPrice()
          .then(result => (isFinite(result) ? result : 0.000001));

        const spotPrice = await crocPool
          .spotPrice()
          .then(result => (isFinite(result) ? result : 0.000001));

        const feeRate = await getLiquidityFee();

        return { price, spotPrice, feeRate };
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      enabled: !!crocPool,
      staleTime: 1000 * 60 * 5, // 5 minutes
    });

  return {
    poolTokens,
    pool: crocPool,
    loading: isPending,
    ...data,
  };
};
