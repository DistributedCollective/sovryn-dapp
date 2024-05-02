import { useMemo } from 'react';

import { BigNumber } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';

import { ChainId, ChainIds, getProvider } from '@sovryn/ethers-provider';
import { SmartRouter } from '@sovryn/sdk';
import { Decimal } from '@sovryn/utils';

import {
  SWAP_ROUTES,
  SMART_ROUTER_STABLECOINS,
} from '../app/5_pages/ConvertPage/ConvertPage.constants';
import { COMMON_SYMBOLS } from '../utils/asset';
import { isRskChain } from '../utils/chain';
import { fromWei, toWei } from '../utils/math';
import { useCacheCall } from './useCacheCall';
import { useCurrentChain } from './useChainStore';
import { useTokenDetailsByAsset } from './useTokenDetailsByAsset';

const STABLECOINS: Partial<Record<ChainIds, string[]>> = {
  [ChainIds.MAINNET]: ['USDT', 'USDC', 'DAI'],
  [ChainIds.BOB_MAINNET]: ['DLLR', 'USDT', 'USDC', 'DAI'],
  [ChainIds.BOB_TESTNET]: ['DLLR', 'USDT', 'USDC', 'DAI'],
  [ChainIds.RSK_MAINNET]: ['DLLR', 'XUSD', 'ZUSD', 'DOC', 'RUSDT'],
  [ChainIds.RSK_TESTNET]: ['DLLR', 'XUSD', 'ZUSD', 'DOC', 'RUSDT'],
};

export function useDollarValue(
  asset: string,
  weiAmount: string,
  chainId?: ChainId,
) {
  const currentChainId = useCurrentChain();
  const chain = chainId || currentChainId;

  const destination = useMemo(
    () => (STABLECOINS[chain]?.[0] ?? COMMON_SYMBOLS.DLLR).toUpperCase(),
    [chain],
  );

  const entry = useMemo(() => {
    if (isRskChain(chain)) {
      if (asset.toUpperCase() === COMMON_SYMBOLS.ZUSD) {
        return COMMON_SYMBOLS.XUSD;
      } else if (asset.toLocaleLowerCase() === 'weth') {
        return COMMON_SYMBOLS.ETH;
      }
    }
    return asset.toUpperCase();
  }, [asset, chain]);

  const assetDetails = useTokenDetailsByAsset(entry, chain);
  const destinationDetails = useTokenDetailsByAsset(destination, chain);

  const { value: usdPrice, loading } = useCacheCall(
    `dollarValue/${chain}/${entry}`,
    chain,
    async () => {
      if (
        entry === destination ||
        (STABLECOINS[chain]?.includes(entry) &&
          STABLECOINS[chain]?.includes(destination))
      ) {
        return formatUnits('1', destinationDetails?.decimals || 18);
      }

      if (
        !assetDetails?.address ||
        !destinationDetails?.address ||
        SMART_ROUTER_STABLECOINS.includes(entry)
      ) {
        return '0';
      }

      const smartRouter = new SmartRouter(getProvider(chain), SWAP_ROUTES);
      // todo: use correct router for chain
      const result = await smartRouter.getBestQuote(
        chain,
        assetDetails?.address,
        destinationDetails?.address,
        toWei('0.01'),
      );

      return BigNumber.from(result.quote.toString() || '0')
        .mul(Math.pow(10, 18 - (destinationDetails?.decimals || 18)))
        .toString();
    },
    [
      weiAmount,
      assetDetails?.address,
      destinationDetails?.address,
      assetDetails,
      destinationDetails,
      chain,
    ],
    '0',
  );

  const usdValue = useMemo(() => {
    if (
      entry === destination ||
      (STABLECOINS[chain]?.includes(entry) &&
        STABLECOINS[chain]?.includes(destination))
    ) {
      return fromWei(weiAmount);
    } else {
      return Decimal.fromBigNumberString(weiAmount)
        .mul(fromWei(usdPrice))
        .toString();
    }
  }, [entry, destination, chain, weiAmount, usdPrice]);

  return {
    loading,
    usdValue,
    usdPrice,
  };
}
