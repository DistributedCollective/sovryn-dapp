import { useMemo } from 'react';

import axios from 'axios';

import { ChainId } from '@sovryn/ethers-provider';

import { RSK_CHAIN_ID } from '../config/chains';

import { BITCOIN, ETH } from '../constants/currencies';
import { COMMON_SYMBOLS } from '../utils/asset';
import { isRskChain } from '../utils/chain';
import { getIndexerUrl } from '../utils/helpers';
import { toWei } from '../utils/math';
import { useCacheCall } from './useCacheCall';
import { useDollarValue } from './useDollarValue';

export const useGetNativeTokenPrice = (chainId: ChainId) => {
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
    const nativePrice = isRskChain(chainId) ? rBTCPrice : ethPrice;
    return nativePrice || '0';
  }, [chainId, rBTCPrice, ethPrice]);

  const nativeToken = useMemo(
    () => (isRskChain(chainId) ? BITCOIN : ETH),
    [chainId],
  );

  return { price, nativeToken };
};
