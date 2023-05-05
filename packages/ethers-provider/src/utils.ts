import { networkMap } from './networks';
import type { ChainId, Network } from './types';

export const getNetworkByChainId = (chainId: ChainId): Network => {
  if (!networkMap.hasOwnProperty(chainId)) {
    throw new Error(`Unknown chainId: ${chainId}`);
  }
  return networkMap[chainId];
};

export const getChainIdByNetwork = (network: Network): ChainId => {
  const chainId = Object.keys(networkMap).find(k => networkMap[k] === network);
  if (!chainId) {
    throw new Error(`Unknown network: ${network}`);
  }
  return chainId;
};

export const numberToChainId = (chainId: number): ChainId =>
  `0x${chainId.toString(16)}` as ChainId;
export const chainIdToNumber = (chainId: ChainId): number =>
  parseInt(chainId, 16);
