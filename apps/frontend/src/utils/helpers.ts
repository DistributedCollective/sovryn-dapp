import { ChainId } from '@sovryn/ethers-provider';

import { Network, networkMap } from '../config/networks';

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

export const prettyTx = (
  text: string,
  startLength: number = 6,
  endLength: number = 4,
) => {
  const start = text.substr(0, startLength);
  const end = text.substr(-endLength);
  return `${start} ··· ${end}`;
};
