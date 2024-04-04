import { useCallback, useEffect, useMemo, useState } from 'react';

import { BOB_CHAIN_ID } from '../../../../../../config/chains';

import { COMMON_SYMBOLS, findAsset } from '../../../../../../utils/asset';
import { ETH_TOKEN } from '../../../../BobAmmPage/fork-constants';
import { useInitializeCroc } from './useInitializeCroc';

// TODO: There will be a dictionary with pools, this is just a temporary solution
const ALLOWED_POOL_TOKENS = [
  COMMON_SYMBOLS.ETH,
  COMMON_SYMBOLS.SOV,
  COMMON_SYMBOLS.WBTC,
  'GLD',
];

export const useGetPoolInfo = (assetA: string, assetB: string) => {
  const [price, setPrice] = useState(0);
  const croc = useInitializeCroc();

  const poolTokens = useMemo(() => {
    if (!croc.current) {
      return;
    }
    // TODO: This is just a temporary solution
    if (
      !ALLOWED_POOL_TOKENS.includes(assetA) ||
      !ALLOWED_POOL_TOKENS.includes(assetB)
    ) {
      return;
    }

    console.log(`ab`);

    let assetAAddress, assetBAddress;

    if (assetA === COMMON_SYMBOLS.ETH) {
      assetAAddress = ETH_TOKEN;
    } else {
      assetAAddress = findAsset(assetB, BOB_CHAIN_ID).address;
    }

    if (assetB === COMMON_SYMBOLS.ETH) {
      assetBAddress = ETH_TOKEN;
    } else {
      assetBAddress = findAsset(assetB, BOB_CHAIN_ID).address;
    }

    const tokenA = croc.current.tokens.materialize(assetAAddress);
    const tokenB = croc.current.tokens.materialize(assetBAddress);

    return { tokenA, tokenB };
  }, [assetA, assetB, croc]);

  const pool = useMemo(() => {
    if (!poolTokens || !croc.current) {
      return;
    }

    return croc.current.pool(
      poolTokens.tokenA.tokenAddr,
      poolTokens.tokenB.tokenAddr,
    );
  }, [croc, poolTokens]);

  const getPoolPrice = useCallback(async () => {
    if (!pool) {
      return;
    }

    return pool.displayPrice().then(result => setPrice(result));
  }, [pool]);

  useEffect(() => {
    if (price === 0) {
      getPoolPrice();
    }
  }, [getPoolPrice, price]);

  return { poolTokens, price };
};
