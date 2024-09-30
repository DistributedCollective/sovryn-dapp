import { useMemo } from 'react';

import axios from 'axios';

import { RSK_CHAIN_ID } from '../config/chains';

import { BITCOIN, ETH } from '../constants/currencies';
import { COMMON_SYMBOLS } from '../utils/asset';
import { isRskChain } from '../utils/chain';
import { getIndexerUrl } from '../utils/helpers';
import { toWei } from '../utils/math';
import { useCacheCall } from './useCacheCall';
import { useCurrentChain } from './useChainStore';
import { useDollarValue } from './useDollarValue';

export const useGetNativeTokenPrice = (token?: 'BTC' | 'ETH') => {
  const currentChainId = useCurrentChain();

  const { value: rBTCPrice } = useCacheCall(
    'rbtc-price/indexer',
    RSK_CHAIN_ID,
    async () => {
      const { data } = await axios.get(getIndexerUrl() + 'tokens', {
        params: {
          chainId: Number(RSK_CHAIN_ID),
          limit: 1,
        },
      });

      const price = data?.data[0]?.usdPrice as string;
      return price ?? '0';
    },
    [RSK_CHAIN_ID],
  );

  const { usdValue: ethPrice } = useDollarValue(
    COMMON_SYMBOLS.ETH,
    toWei(1).toString(),
  );

  const price = useMemo(() => {
    const nativePrice =
      isRskChain(currentChainId) || token === BITCOIN ? rBTCPrice : ethPrice;
    return nativePrice || '0';
  }, [token, currentChainId, ethPrice, rBTCPrice]);

  const nativeToken = useMemo(
    () => (isRskChain(currentChainId) || token === BITCOIN ? BITCOIN : ETH),
    [token, currentChainId],
  );

  return { price, nativeToken };
};
