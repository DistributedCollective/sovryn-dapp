import { useMemo } from 'react';

import { ChainId } from '@sovryn/ethers-provider';

import { loadIndexer } from '../lib/indexer';
import { getCurrentChain } from './useChainStore';

export function useIndexer(chain?: ChainId) {
  const chainId = chain ?? getCurrentChain();
  return useMemo(() => loadIndexer(chainId), [chainId]);
}
