import { useCallback, useEffect, useState } from 'react';

import { useCurrentChain } from '../../../../../../hooks/useChainStore';
import { getIndexerUri } from '../../../../../../utils/indexer';
import { useGetPool } from '../../../hooks/useGetPool';

export const useGetPoolInfo = (assetA: string, assetB: string) => {
  const chainId = useCurrentChain();
  const { pool, poolTokens } = useGetPool(assetA, assetB);

  const [price, setPrice] = useState(0);
  const [spotPrice, setSpotPrice] = useState(0);
  const [feeRate, setFeeRate] = useState('0');

  const getPoolPrice = useCallback(async () => {
    if (!pool) {
      return;
    }

    return pool.displayPrice().then(result => {
      if (isFinite(result)) {
        setPrice(result);
      } else {
        setPrice(0.000001); // fake price for non existing pools, to prevent ui crashes.
      }
    });
  }, [pool]);

  const getSpotPrice = useCallback(async () => {
    if (!pool) {
      return;
    }

    return pool.spotPrice().then(result => {
      if (isFinite(result)) {
        setSpotPrice(result);
      } else {
        setSpotPrice(0.000001); // fake price for non existing pools, to prevent ui crashes.
      }
    });
  }, [pool]);

  const getLiquidityFee = useCallback(async () => {
    if (!pool || !poolTokens) {
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

        setFeeRate(payload.feeRate);
      })
      .catch(error => {
        return undefined;
      });
  }, [chainId, pool, poolTokens]);

  useEffect(() => {
    if (price === 0) {
      getPoolPrice();
    }
  }, [getPoolPrice, price]);

  useEffect(() => {
    if (spotPrice === 0) {
      getSpotPrice();
    }
  }, [getSpotPrice, spotPrice]);

  useEffect(() => {
    if (feeRate === '0') {
      getLiquidityFee();
    }
  }, [feeRate, getLiquidityFee, pool]);

  return { poolTokens, price, feeRate, pool, spotPrice };
};
