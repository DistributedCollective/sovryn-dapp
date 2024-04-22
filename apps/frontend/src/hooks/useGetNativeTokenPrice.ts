import { useMemo } from 'react';

import { COMMON_SYMBOLS } from '../utils/asset';
import { isRskChain } from '../utils/chain';
import { toWei } from '../utils/math';
import { useCurrentChain } from './useChainStore';
import { useDollarValue } from './useDollarValue';
import { useGetRBTCPrice } from './zero/useGetRBTCPrice';

export const useGetNativeTokenPrice = () => {
  const chainId = useCurrentChain();
  const { price: rBTCPrice } = useGetRBTCPrice();

  const { usdValue: ethPrice } = useDollarValue(
    COMMON_SYMBOLS.ETH,
    toWei(1).toString(),
  );

  const price = useMemo(
    () => (isRskChain(chainId) ? rBTCPrice : ethPrice),
    [chainId, ethPrice, rBTCPrice],
  );

  return { price };
};
