import { providers } from 'ethers';
import { state } from './store';
import type { Chain, ChainId } from './types';

export const ethersProviders: {
  [key: string]: providers.StaticJsonRpcProvider;
} = {};

export function getProvider(): providers.StaticJsonRpcProvider;
export function getProvider(
  chain: ChainId | Chain,
): providers.StaticJsonRpcProvider;

export function getProvider(
  chainOrChainId?: ChainId | Chain,
): providers.StaticJsonRpcProvider {
  let chain: Chain;

  if (chainOrChainId === undefined) {
    chain = state.get().chains[0] as Chain;
  }

  if (typeof chainOrChainId === 'string') {
    chain = state.get().chains.find(c => c.id === chainOrChainId) as Chain;
  }

  if (typeof chainOrChainId === 'object') {
    chain = chainOrChainId as Chain;
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (!chain) return null;

  if (!ethersProviders[chain.rpcUrl]) {
    ethersProviders[chain.rpcUrl] = new providers.StaticJsonRpcProvider(
      chain.providerConnectionInfo && chain.providerConnectionInfo.url
        ? chain.providerConnectionInfo
        : chain.rpcUrl,
    );
  }

  return ethersProviders[chain.rpcUrl];
}
