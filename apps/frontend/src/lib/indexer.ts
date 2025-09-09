import { ChainId, chainIdToNumber } from '@sovryn/ethers-provider';
import { Indexer, IndexerEnv } from '@sovryn/sdk';

const IS_MAINNET = process.env.REACT_APP_NETWORK === 'mainnet';
const IS_STAGING = process.env.REACT_APP_STAGING === 'true';

const indexers = new Map<ChainId, Indexer>();

export const loadIndexer = (chainId: ChainId) => {
  if (!indexers.has(chainId)) {
    indexers.set(
      chainId,
      new Indexer(
        chainIdToNumber(chainId),
        IS_STAGING
          ? IndexerEnv.staging
          : IS_MAINNET
          ? IndexerEnv.mainnet
          : IndexerEnv.testnet,
      ),
    );
  }

  return indexers.get(chainId)!;
};
