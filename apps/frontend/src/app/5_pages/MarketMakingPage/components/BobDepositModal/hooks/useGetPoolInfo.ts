import { useCallback, useEffect, useState } from 'react';

import { Pool } from '@sovryn/sdk';

import { useCurrentChain } from '../../../../../../hooks/useChainStore';
import { getIndexerUri } from '../../../../../../utils/indexer';
import { useGetPool } from '../../../hooks/useGetPool';

export const useGetPoolInfo = (pool: Pool) => {
  const chainId = useCurrentChain();
  const { pool: crocPool, poolTokens } = useGetPool(pool);

  const [price, setPrice] = useState(0);
  const [spotPrice, setSpotPrice] = useState(0);
  const [feeRate, setFeeRate] = useState('0');
  const [loading, setLoading] = useState(true);
  const getPoolPrice = useCallback(async () => {
    if (!crocPool) {
      return;
    }

    return crocPool.displayPrice().then(result => {
      if (isFinite(result)) {
        setPrice(result);
      } else {
        setPrice(0.000001); // fake price for non existing pools, to prevent ui crashes.
      }
    });
  }, [crocPool]);

  const getSpotPrice = useCallback(async () => {
    if (!crocPool) {
      return;
    }

    return crocPool.spotPrice().then(result => {
      if (isFinite(result)) {
        setSpotPrice(result);
      } else {
        setSpotPrice(0.000001); // fake price for non existing pools, to prevent ui crashes.
      }
    });
  }, [crocPool]);

  const getLiquidityFee = useCallback(async () => {
    if (!crocPool || !poolTokens) {
      return;
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
          return undefined;
        }

        const payload = json.data;

        setFeeRate((payload.feeRate * 100).toString());
      })
      .catch(error => {
        return undefined;
      });
  }, [chainId, crocPool, poolTokens]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    await Promise.all([getPoolPrice(), getSpotPrice(), getLiquidityFee()]);
    setLoading(false);
  }, [getPoolPrice, getSpotPrice, getLiquidityFee]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { poolTokens, price, feeRate, pool: crocPool, spotPrice, loading };
};
