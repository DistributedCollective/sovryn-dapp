import { providers } from 'ethers';

import { FallbackProvider } from './lib/fallback-provider';
import { state } from './store';
import type { Chain, ChainId } from './types';

export const ethersProviders: {
  [key: string]: providers.Provider;
} = {};

export function getProvider(): providers.Provider;
export function getProvider(chain: ChainId | Chain): providers.Provider;

export function getProvider(
  chainOrChainId?: ChainId | Chain,
): providers.Provider {
  let chain: Chain | undefined;

  if (chainOrChainId === undefined) {
    chain = state.get().chains[0] as Chain;
  }

  if (typeof chainOrChainId === 'string') {
    chain = state.get().chains.find(c => c.id === chainOrChainId) as Chain;
  }

  if (typeof chainOrChainId === 'object') {
    chain = chainOrChainId as Chain;
  }

  if (!chain) {
    throw new Error('No chain found');
  }

  const rpc = typeof chain.rpcUrl === 'string' ? chain.rpcUrl : chain.rpcUrl[0];

  if (!ethersProviders[rpc]) {
    if (Array.isArray(chain.rpcUrl)) {
      const rpcs = chain.rpcUrl.map(
        url => new providers.StaticJsonRpcProvider(url),
      );
      ethersProviders[rpc] = new FallbackProvider(rpcs, 1);
    } else {
      ethersProviders[rpc] = new providers.StaticJsonRpcProvider(
        chain.providerConnectionInfo && chain.providerConnectionInfo.url
          ? chain.providerConnectionInfo
          : rpc,
      );
    }
  }

  return ethersProviders[rpc];
}
