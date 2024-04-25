import { useMemo } from 'react';

import { useCrocContext } from '../../../../contexts/CrocContext';
import { useCurrentChain } from '../../../../hooks/useChainStore';
import { findAsset } from '../../../../utils/asset';
import { AmbientLiquidityPoolDictionary } from '../components/AmbientMarketMaking/utils/AmbientLiquidityPoolDictionary';

export const useGetPool = (assetA: string, assetB: string) => {
  const chainId = useCurrentChain();

  const { croc } = useCrocContext();

  const poolTokens = useMemo(() => {
    if (!croc) {
      return;
    }

    const assetAAddress = findAsset(assetA, chainId).address;
    const assetBAddress = findAsset(assetB, chainId).address;

    const tokenA = croc.tokens.materialize(assetAAddress);
    const tokenB = croc.tokens.materialize(assetBAddress);

    const { poolIndex } = AmbientLiquidityPoolDictionary.get(
      assetA,
      assetB,
      chainId,
    );

    return { tokenA, tokenB, poolIndex };
  }, [assetA, assetB, chainId, croc]);

  const pool = useMemo(() => {
    if (!poolTokens || !croc) {
      return;
    }

    return croc.pool(
      poolTokens.tokenA.tokenAddr,
      poolTokens.tokenB.tokenAddr,
      poolTokens.poolIndex,
    );
  }, [croc, poolTokens]);

  return {
    pool,
    poolTokens,
  };
};
