import { INDEXER_URL, INDEXER_URL_TESTNET } from './constants';
import { Pools } from './pools';
import { IndexerEnv } from './types';

export class Indexer {
  readonly url: string;
  readonly pools: Pools;

  constructor(
    readonly chainId: number,
    readonly env: IndexerEnv = IndexerEnv.mainnet,
  ) {
    this.url = env === IndexerEnv.mainnet ? INDEXER_URL : INDEXER_URL_TESTNET;

    this.pools = new Pools(this);
  }
}
