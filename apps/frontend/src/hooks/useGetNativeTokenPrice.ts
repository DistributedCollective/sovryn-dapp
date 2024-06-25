import { useMemo } from 'react';

import { COMMON_SYMBOLS } from '../utils/asset';
import { isBobChain, isRskChain } from '../utils/chain';
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

  const price = useMemo(() => {
    if (isRskChain(chainId)) {
      return rBTCPrice;
    } else if (isBobChain(chainId)) {
      return ethPrice;
    } else {
      return ethPrice; // TODO: Adjust we have more supported chains.
    }
  }, [chainId, ethPrice, rBTCPrice]);

  return { price };
};
