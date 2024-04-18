import { useMemo } from 'react';

import { useCrocContext } from '../../../../../../contexts/CrocContext';
import { useCurrentChain } from '../../../../../../hooks/useChainStore';
import { COMMON_SYMBOLS, findAsset } from '../../../../../../utils/asset';
import { ETH_TOKEN } from '../../../../BobAmmPage/fork-constants';

export const useGetPool = (assetA: string, assetB: string) => {
  const chainId = useCurrentChain();

  const { croc } = useCrocContext();

  const poolTokens = useMemo(() => {
    if (!croc) {
      return;
    }

    let assetAAddress, assetBAddress;

    if (assetA === COMMON_SYMBOLS.ETH) {
      assetAAddress = ETH_TOKEN;
    } else {
      assetAAddress = findAsset(assetB, chainId).address;
    }

    if (assetB === COMMON_SYMBOLS.ETH) {
      assetBAddress = ETH_TOKEN;
    } else {
      assetBAddress = findAsset(assetB, chainId).address;
    }

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
