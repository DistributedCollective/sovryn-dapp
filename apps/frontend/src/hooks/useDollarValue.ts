import { useMemo } from 'react';

import { ChainId, ChainIds } from '@sovryn/ethers-provider';
import { toDisplayPrice } from '@sovryn/sdex';
import { Decimal } from '@sovryn/utils';

import { useTokenPrices } from '../contexts/TokenPricesContext';
import { COMMON_SYMBOLS } from '../utils/asset';
import { isRskChain } from '../utils/chain';
import { fromWei } from '../utils/math';
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
  const { prices, loading: pricesLoading } = useTokenPrices();

  const destination = useMemo(
    () => (STABLECOINS[chain]?.[0] ?? COMMON_SYMBOLS.DLLR).toUpperCase(),
    [chain],
  );

  const entry = useMemo(() => {
    if (asset.toUpperCase() === COMMON_SYMBOLS.OSSOV) {
      return COMMON_SYMBOLS.SOV;
    }

    if (isRskChain(chain)) {
      if (asset.toUpperCase() === COMMON_SYMBOLS.ZUSD) {
        return COMMON_SYMBOLS.XUSD;
      } else if (asset.toLocaleLowerCase() === 'weth') {
        return COMMON_SYMBOLS.ETH;
      } else if (['wbtc', 'tbtc'].includes(asset.toLocaleLowerCase())) {
        return COMMON_SYMBOLS.BTC;
      } else if (asset.toLocaleLowerCase() === 'esov') {
        return COMMON_SYMBOLS.SOV;
      }
    }
    return asset.toUpperCase();
  }, [asset, chain]);

  const assetDetails = useTokenDetailsByAsset(entry, chain);
  const destinationDetails = useTokenDetailsByAsset(destination, chain);

  const usdPrice = useMemo(() => {
    if (assetDetails && assetDetails.address) {
      return prices[assetDetails.address.toLowerCase()] || '0';
    }
    return '0';
  }, [prices, assetDetails]);

  const usdValue = useMemo(() => {
    if (
      entry === destination ||
      (STABLECOINS[chain]?.includes(entry) &&
        STABLECOINS[chain]?.includes(destination))
    ) {
      const amount = Number(fromWei(weiAmount, assetDetails?.decimals || 18));

      return toDisplayPrice(
        amount,
        destinationDetails?.decimals || 18,
        assetDetails?.decimals || 18,
      ).toString();
    } else {
      const amount = Decimal.fromBigNumberString(weiAmount)
        .mul(usdPrice)
        .toString();

      return amount;
    }
  }, [
    entry,
    destination,
    chain,
    weiAmount,
    assetDetails?.decimals,
    destinationDetails?.decimals,
    usdPrice,
  ]);

  return {
    loading: pricesLoading,
    usdValue,
    usdPrice,
  };
}
