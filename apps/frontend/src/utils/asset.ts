import { contracts } from '@sovryn/contracts';
import {
  ChainId,
  ChainIds,
  getNetworkByChainId,
} from '@sovryn/ethers-provider';

import { RSK_CHAIN_ID } from '../config/chains';

export const normalizeAsset = (asset: string, chainId: ChainId) =>
  contracts.assets[getNetworkByChainId(chainId)]?.find(
    item => item.symbol.toLowerCase() === asset.toLowerCase(),
  )!;

export const normalizeNativeAsset = (chainId: ChainId) =>
  contracts.assets[getNetworkByChainId(chainId)]?.find(item => item.isNative)!;

export const listAssetsOfChain = (chainId: ChainId) =>
  contracts.assets[getNetworkByChainId(chainId)] || [];

export const COMMON_SYMBOLS = {
  BTC: 'BTC',
  WBTC: 'WBTC',
  SOV: 'SOV',
  DLLR: 'DLLR',
  ZUSD: 'ZUSD',
  XUSD: 'XUSD',
  DOC: 'DOC',
};

export const maybeWrappedAsset = (
  asset: string,
  chainId: ChainId = RSK_CHAIN_ID,
) => {
  asset = asset.toUpperCase();
  if (
    asset === COMMON_SYMBOLS.BTC &&
    [ChainIds.RSK_MAINNET, ChainIds.RSK_TESTNET].includes(chainId as ChainIds)
  ) {
    return 'WBTC';
  }
  return normalizeAsset(asset, chainId)?.symbol || asset.toUpperCase();
};

export const maybeUnwrappedAsset = (
  asset: string,
  chainId: ChainId = RSK_CHAIN_ID,
) => {
  asset = asset.toUpperCase();
  if (
    asset === 'WBTC' &&
    [ChainIds.RSK_MAINNET, ChainIds.RSK_TESTNET].includes(chainId as ChainIds)
  ) {
    return COMMON_SYMBOLS.BTC;
  }
  return normalizeAsset(asset, chainId)?.symbol || asset.toUpperCase();
};
