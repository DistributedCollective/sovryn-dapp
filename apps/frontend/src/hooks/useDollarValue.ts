import { useMemo } from 'react';

import { ChainId } from '@sovryn/ethers-provider';

import { RSK_CHAIN_ID } from '../config/chains';

import {
  SMART_ROUTER_RSK,
  SMART_ROUTER_STABLECOINS,
} from '../app/5_pages/ConvertPage/ConvertPage.constants';
import { COMMON_SYMBOLS } from '../utils/asset';
import { isRskChain } from '../utils/chain';
import { decimalic, fromWei, toWei } from '../utils/math';
import { useCacheCall } from './useCacheCall';
import { useCurrentChain } from './useChainStore';
import { useTokenDetailsByAsset } from './useTokenDetailsByAsset';
import { useGetRBTCPrice } from './zero/useGetRBTCPrice';

export function useDollarValue(
  asset: string,
  weiAmount: string,
  chainId?: ChainId,
) {
  const chain = useCurrentChain();
  if (['zusd', 'usdc', 'usdt', 'dai'].includes(asset.toLowerCase())) {
    if (isRskChain(chainId || chain)) {
      asset = COMMON_SYMBOLS.XUSD;
    } else {
      asset = COMMON_SYMBOLS.DLLR;
    }
  }
  const assetDetails = useTokenDetailsByAsset(asset, chainId || chain);
  const dllrDetails = useTokenDetailsByAsset(
    COMMON_SYMBOLS.DLLR, // todo: define USD equivalent token for all chains in config
    chainId || chain,
  );
  const { price: btcPrice } = useGetRBTCPrice();

  const { value: usdPrice, loading } = useCacheCall(
    `dollarValue/${asset}`,
    chainId || chain,
    async () => {
      if (
        !assetDetails?.address ||
        !dllrDetails?.address ||
        SMART_ROUTER_STABLECOINS.includes(asset)
      ) {
        return '0';
      }

      // todo: use correct router for chain
      const result = await SMART_ROUTER_RSK.getBestQuote(
        RSK_CHAIN_ID,
        assetDetails?.address,
        dllrDetails?.address,
        toWei('0.01'),
      );
      return fromWei(
        decimalic(result.quote.toString() || '0')
          .mul(100)
          .toString(),
      );
    },
    [
      weiAmount,
      assetDetails?.address,
      dllrDetails?.address,
      assetDetails,
      dllrDetails,
      asset,
    ],
    '0',
  );

  const usdValue = useMemo(() => {
    const decimals = assetDetails?.decimals || 18;

    if (SMART_ROUTER_STABLECOINS.includes(asset)) {
      return fromWei(weiAmount);
    } else {
      return decimalic(weiAmount)
        .mul(assetDetails?.isNative ? btcPrice : usdPrice)
        .div(10 ** decimals)
        .toString();
    }
  }, [
    assetDetails?.decimals,
    assetDetails?.isNative,
    asset,
    weiAmount,
    btcPrice,
    usdPrice,
  ]);

  return {
    loading,
    usdValue,
    usdPrice,
  };
}
