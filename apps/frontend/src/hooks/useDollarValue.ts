import { useMemo } from 'react';

import { ChainId, getProvider } from '@sovryn/ethers-provider';
import { SmartRouter } from '@sovryn/sdk';

import {
  SWAP_ROUTES,
  SMART_ROUTER_STABLECOINS,
} from '../app/5_pages/ConvertPage/ConvertPage.constants';
import { COMMON_SYMBOLS } from '../utils/asset';
import { isRskChain } from '../utils/chain';
import { decimalic, fromWei, toWei } from '../utils/math';
import { useCacheCall } from './useCacheCall';
import { useCurrentChain } from './useChainStore';
import { useTokenDetailsByAsset } from './useTokenDetailsByAsset';

export function useDollarValue(
  asset: string,
  weiAmount: string,
  chainId?: ChainId,
) {
  const currentChainId = useCurrentChain();
  const chain = chainId || currentChainId;

  if (asset.toUpperCase() === COMMON_SYMBOLS.ZUSD) {
    if (isRskChain(chain)) {
      asset = COMMON_SYMBOLS.XUSD;
    } else {
      asset = 'USDT';
    }
  } else if (asset.toLocaleLowerCase() === 'weth') {
    asset = COMMON_SYMBOLS.ETH;
  }
  const assetDetails = useTokenDetailsByAsset(asset, chain);
  const dllrDetails = useTokenDetailsByAsset(
    COMMON_SYMBOLS.DLLR, // todo: define USD equivalent token for all chains in config
    chain,
  );

  const { value: usdPrice, loading } = useCacheCall(
    `dollarValue/${chain}/${asset}`,
    chain,
    async () => {
      if (
        !assetDetails?.address ||
        !dllrDetails?.address ||
        SMART_ROUTER_STABLECOINS.includes(asset)
      ) {
        return '0';
      }

      const smartRouter = new SmartRouter(getProvider(chain), SWAP_ROUTES);
      // todo: use correct router for chain
      const result = await smartRouter.getBestQuote(
        chain,
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
      chain,
    ],
    '0',
  );

  const usdValue = useMemo(() => {
    const decimals = assetDetails?.decimals || 18;

    if (SMART_ROUTER_STABLECOINS.includes(asset)) {
      return fromWei(weiAmount);
    } else {
      return decimalic(weiAmount)
        .mul(usdPrice)
        .div(10 ** decimals)
        .toString();
    }
  }, [assetDetails?.decimals, asset, weiAmount, usdPrice]);

  return {
    loading,
    usdValue,
    usdPrice,
  };
}
