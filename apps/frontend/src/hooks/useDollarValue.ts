import { useMemo } from 'react';

import { SupportedTokens } from '@sovryn/contracts';

import { RSK_CHAIN_ID } from '../config/chains';

import {
  SMART_ROUTER_RSK,
  SMART_ROUTER_STABLECOINS,
} from '../app/5_pages/ConvertPage/ConvertPage.constants';
import { decimalic, fromWei, toWei } from '../utils/math';
import { useCacheCall } from './useCacheCall';
import { useTokenDetailsByAsset } from './useTokenDetailsByAsset';
import { useGetRBTCPrice } from './zero/useGetRBTCPrice';

export function useDollarValue(asset: SupportedTokens, weiAmount: string) {
  if (asset === SupportedTokens.zusd) {
    asset = SupportedTokens.xusd;
  }
  const assetDetails = useTokenDetailsByAsset(asset);
  const dllrDetails = useTokenDetailsByAsset(SupportedTokens.dllr);
  const { price: btcPrice } = useGetRBTCPrice();
  const isNativeAsset = useMemo(() => asset === SupportedTokens.rbtc, [asset]);

  const { value: usdPrice, loading } = useCacheCall(
    `dollarValue/${asset}`,
    RSK_CHAIN_ID,
    async () => {
      if (
        !assetDetails?.address ||
        !dllrDetails?.address ||
        SMART_ROUTER_STABLECOINS.includes(asset)
      ) {
        return '0';
      }

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
    const decimals = assetDetails?.decimalPrecision || 18;

    if (SMART_ROUTER_STABLECOINS.includes(asset)) {
      return fromWei(weiAmount);
    } else {
      return decimalic(weiAmount)
        .mul(isNativeAsset ? btcPrice : usdPrice)
        .div(10 ** decimals)
        .toString();
    }
  }, [
    asset,
    assetDetails?.decimalPrecision,
    usdPrice,
    weiAmount,
    btcPrice,
    isNativeAsset,
  ]);

  return {
    loading,
    usdValue,
    usdPrice,
  };
}
