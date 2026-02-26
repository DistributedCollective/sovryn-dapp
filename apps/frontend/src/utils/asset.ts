import { contracts } from '@sovryn/contracts';
import {
  ChainId,
  ChainIds,
  getNetworkByChainId,
} from '@sovryn/ethers-provider';

import { RSK_CHAIN_ID } from '../config/chains';

export const findAsset = (asset: string, chainId: ChainId) =>
  contracts.assets[getNetworkByChainId(chainId)]?.find(
    item => item.symbol.toLowerCase() === asset.toLowerCase(),
  )!;

export const findAssetByAddress = (address: string, chainId: ChainId) =>
  contracts.assets[getNetworkByChainId(chainId)]?.find(
    item => item.address.toLowerCase() === address.toLowerCase(),
  )!;

export const findNativeAsset = (chainId: ChainId) =>
  contracts.assets[getNetworkByChainId(chainId)]?.find(item => item.isNative)!;

export const listAssetsOfChain = (chainId: ChainId) =>
  contracts.assets[getNetworkByChainId(chainId)] || [];

export const COMMON_SYMBOLS = {
  BTC: 'BTC',
  WBTC: 'WBTC',
  SOV: 'SOV',
  OSSOV: 'OSSOV',
  DLLR: 'DLLR',
  ZUSD: 'ZUSD',
  XUSD: 'XUSD',
  DOC: 'DOC',
  BPRO: 'BPRO',
  RUSDT: 'RUSDT',
  ETH: 'ETH',
  WBTC_OLD: 'WBTC.OLD',
  USDT0: 'USDT0',
};

export const compareAssets = (asset1?: string | null, asset2?: string | null) =>
  asset1?.toUpperCase() === asset2?.toUpperCase();

export const maybeWrappedAsset = (
  asset: string,
  chainId: ChainId = RSK_CHAIN_ID,
) => {
  asset = asset.toUpperCase();
  if (
    asset === COMMON_SYMBOLS.BTC &&
    [ChainIds.RSK_MAINNET, ChainIds.RSK_TESTNET].includes(chainId as ChainIds)
  ) {
    return COMMON_SYMBOLS.WBTC;
  }
  return findAsset(asset, chainId)?.symbol || asset.toUpperCase();
};

export const maybeUnwrappedAsset = (
  asset: string,
  chainId: ChainId = RSK_CHAIN_ID,
) => {
  asset = asset.toUpperCase();
  if (
    compareAssets(asset, COMMON_SYMBOLS.WBTC) &&
    [ChainIds.RSK_MAINNET, ChainIds.RSK_TESTNET].includes(chainId as ChainIds)
  ) {
    return COMMON_SYMBOLS.BTC;
  }
  return findAsset(asset, chainId)?.symbol || asset.toUpperCase();
};
