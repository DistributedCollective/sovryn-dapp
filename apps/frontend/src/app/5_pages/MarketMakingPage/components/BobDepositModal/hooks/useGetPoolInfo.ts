import { useCallback, useEffect, useMemo, useState } from 'react';

import { useCrocContext } from '../../../../../../contexts/CrocContext';
import { useCurrentChain } from '../../../../../../hooks/useChainStore';
import { findAsset } from '../../../../../../utils/asset';
import { getIndexerUri } from '../../../../../../utils/indexer';

export const useGetPoolInfo = (assetA: string, assetB: string) => {
  const chainId = useCurrentChain();

  const [price, setPrice] = useState(0);
  const [feeRate, setFeeRate] = useState('0');
  const { croc } = useCrocContext();

  const poolTokens = useMemo(() => {
    if (!croc) {
      return;
    }

    const assetAAddress = findAsset(assetA, chainId).address;
    const assetBAddress = findAsset(assetB, chainId).address;

    const tokenA = croc.tokens.materialize(assetAAddress);
    const tokenB = croc.tokens.materialize(assetBAddress);

    return { tokenA, tokenB };
  }, [assetA, assetB, chainId, croc]);

  const pool = useMemo(() => {
    if (!poolTokens || !croc) {
      return;
    }

    return croc.pool(poolTokens.tokenA.tokenAddr, poolTokens.tokenB.tokenAddr);
  }, [croc, poolTokens]);

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
          poolIdx: (await pool.context).chain.poolIndex.toString(),
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
    if (feeRate === '0') {
      getLiquidityFee();
    }
  }, [feeRate, getLiquidityFee, pool]);

  return { poolTokens, price, feeRate, pool };
};
