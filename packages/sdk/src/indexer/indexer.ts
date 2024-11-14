import { INDEXER_URL, INDEXER_URL_TESTNET } from './constants';
import { PoolList } from './pools';
import { TokenList } from './tokens';
import { IndexerEnv } from './types';

export class Indexer {
  readonly url: string;
  readonly pools: PoolList;
  readonly tokens: TokenList;

  constructor(
    readonly chainId: number,
    readonly env: IndexerEnv = IndexerEnv.mainnet,
  ) {
    this.url = env === IndexerEnv.mainnet ? INDEXER_URL : INDEXER_URL_TESTNET;

    this.pools = new PoolList(this);
    this.tokens = new TokenList(this);
  }
}
