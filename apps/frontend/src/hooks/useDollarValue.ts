import { useMemo } from 'react';

import { RSK_CHAIN_ID } from '../config/chains';

import {
  SMART_ROUTER_RSK,
  SMART_ROUTER_STABLECOINS,
} from '../app/5_pages/ConvertPage/ConvertPage.constants';
import { decimalic, fromWei, toWei } from '../utils/math';
import { useCacheCall } from './useCacheCall';
import { useTokenDetailsByAsset } from './useTokenDetailsByAsset';
import { useGetRBTCPrice } from './zero/useGetRBTCPrice';
import { COMMON_SYMBOLS } from '../utils/asset';

export function useDollarValue(asset: string, weiAmount: string) {
  if (asset.toLowerCase() === 'zusd') {
    asset = 'xusd';
  }
  const assetDetails = useTokenDetailsByAsset(asset);
  const dllrDetails = useTokenDetailsByAsset(COMMON_SYMBOLS.DLLR);
  const { price: btcPrice } = useGetRBTCPrice();

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
