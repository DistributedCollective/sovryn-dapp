import { SupportedTokens } from '@sovryn/contracts';

import { LendingPool } from './LendingPool';

export class LendingPoolDictionary {
  public static pools: Map<SupportedTokens, LendingPool> = new Map<
    SupportedTokens,
    LendingPool
  >([
    [
      SupportedTokens.dllr,
      new LendingPool(
        'DLLR',
        SupportedTokens.dllr,
        [SupportedTokens.rbtc, SupportedTokens.bpro, SupportedTokens.sov],
        false,
        false,
      ),
    ],
    [
      SupportedTokens.rbtc,
      new LendingPool(
        'RBTC',
        SupportedTokens.rbtc,
        [
          SupportedTokens.dllr,
          SupportedTokens.xusd,
          SupportedTokens.sov,
          SupportedTokens.bpro,
          SupportedTokens.doc,
        ],
        false,
        false,
      ),
    ],
    /*[
      SupportedTokens.xusd,
      new LendingPool(
        'XUSD',
        SupportedTokens.xusd,
        [SupportedTokens.rbtc, SupportedTokens.bpro, SupportedTokens.sov],
        true,
        false,
      ),
    ],
    [
      SupportedTokens.doc,
      new LendingPool(
        'DoC',
        SupportedTokens.doc,
        [
          SupportedTokens.rbtc,
          SupportedTokens.xusd,
          SupportedTokens.bpro,
          SupportedTokens.sov,
        ],
        false,
        false,
      ),
    ],
    [
      SupportedTokens.rusdt,
      new LendingPool('USDT', SupportedTokens.rusdt, [], false, true),
    ],
    [
      SupportedTokens.bpro,
      new LendingPool(
        'BPRO',
        SupportedTokens.bpro,
        [
          SupportedTokens.dllr,
          SupportedTokens.rbtc,
          SupportedTokens.xusd,
          SupportedTokens.doc,
          SupportedTokens.sov,
        ],
        false,
        false,
      ),
    ],*/
  ]);

  public static get(asset: SupportedTokens): LendingPool {
    return this.pools.get(asset) as LendingPool;
  }

  public static list(): Array<LendingPool> {
    return Array.from(this.pools.values());
  }

  public static assetList(): Array<SupportedTokens> {
    return Array.from(this.pools.keys());
  }

  public static find(assets: Array<SupportedTokens>): Array<LendingPool> {
    return assets.map(asset => this.get(asset));
  }

  public static entries() {
    return Array.from(this.pools.entries());
  }
}
