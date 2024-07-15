import { useMemo } from 'react';

import axios from 'axios';

import { RSK_CHAIN_ID } from '../config/chains';

import { COMMON_SYMBOLS } from '../utils/asset';
import { isRskChain } from '../utils/chain';
import { getIndexerUrl } from '../utils/helpers';
import { toWei } from '../utils/math';
import { useCacheCall } from './useCacheCall';
import { getCurrentChain, useCurrentChain } from './useChainStore';
import { useDollarValue } from './useDollarValue';

export const useGetNativeTokenPrice = () => {
  const chainId = useCurrentChain();

  const { value: rBTCPrice } = useCacheCall(
    'rbtc-price/indexer',
    getCurrentChain(),
    async () => {
      const { data } = await axios.get(getIndexerUrl() + 'tokens', {
        params: {
          chainId: Number(RSK_CHAIN_ID),
          limit: 1,
        },
      });

      const price = data?.data[0]?.usdPrice as string;

      return price;
    },
  );

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
