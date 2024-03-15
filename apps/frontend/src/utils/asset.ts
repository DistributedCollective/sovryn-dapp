import { contracts } from '@sovryn/contracts';
import { ChainId, getNetworkByChainId } from '@sovryn/ethers-provider';

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
  SOV: 'SOV',
  DLLR: 'DLLR',
  ZUSD: 'ZUSD',
  XUSD: 'XUSD',
  DOC: 'DOC',
};
