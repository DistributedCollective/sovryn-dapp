import { ChainId, chainIdToNumber } from '@sovryn/ethers-provider';
import { Indexer, IndexerEnv } from '@sovryn/sdk';

import { isMainnet } from '../utils/helpers';

const indexers = new Map<ChainId, Indexer>();

export const loadIndexer = (chainId: ChainId) => {
  if (!indexers.has(chainId)) {
    indexers.set(
      chainId,
      new Indexer(
        chainIdToNumber(chainId),
        isMainnet() ? IndexerEnv.mainnet : IndexerEnv.testnet,
      ),
    );
  }

  return indexers.get(chainId)!;
};
