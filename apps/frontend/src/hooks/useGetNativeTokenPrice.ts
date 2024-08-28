import { useMemo } from 'react';

import axios from 'axios';

import { BITCOIN, ETH } from '../constants/currencies';
import { COMMON_SYMBOLS } from '../utils/asset';
import { isRskChain } from '../utils/chain';
import { getIndexerUrl } from '../utils/helpers';
import { toWei } from '../utils/math';
import { useCacheCall } from './useCacheCall';
import { useCurrentChain } from './useChainStore';
import { useDollarValue } from './useDollarValue';

export const useGetNativeTokenPrice = () => {
  const currentChainId = useCurrentChain();

  const { value: rBTCPrice } = useCacheCall(
    'rbtc-price/indexer',
    currentChainId,
    async () => {
      const { data } = await axios.get(getIndexerUrl() + 'tokens', {
        params: {
          chainId: Number(currentChainId),
          limit: 1,
        },
      });

      const price = data?.data[0]?.usdPrice as string;

      return price;
    },
    [currentChainId],
  );

  const { usdValue: ethPrice } = useDollarValue(
    COMMON_SYMBOLS.ETH,
    toWei(1).toString(),
  );

  const price = useMemo(
    () => (isRskChain(currentChainId) ? rBTCPrice : ethPrice),
    [currentChainId, ethPrice, rBTCPrice],
  );

  const nativeToken = useMemo(
    () => (isRskChain(currentChainId) ? BITCOIN : ETH),
    [currentChainId],
  );

  return { price, nativeToken };
};
