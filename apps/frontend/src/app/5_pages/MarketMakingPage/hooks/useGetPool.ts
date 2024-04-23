import { useMemo } from 'react';

import { useCrocContext } from '../../../../contexts/CrocContext';
import { useCurrentChain } from '../../../../hooks/useChainStore';
import { findAsset } from '../../../../utils/asset';

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

    return { tokenA, tokenB };
  }, [assetA, assetB, chainId, croc]);

  const pool = useMemo(() => {
    if (!poolTokens || !croc) {
      return;
    }

    return croc.pool(poolTokens.tokenA.tokenAddr, poolTokens.tokenB.tokenAddr);
  }, [croc, poolTokens]);

  return {
    pool,
    poolTokens,
  };
};
