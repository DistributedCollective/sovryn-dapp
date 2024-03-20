import { LendingPool } from './LendingPool';
import { COMMON_SYMBOLS } from './asset';

export class LendingPoolDictionary {
  public static pools: Map<string, LendingPool> = new Map<string, LendingPool>([
    [
      COMMON_SYMBOLS.DLLR,
      new LendingPool(
        COMMON_SYMBOLS.DLLR,
        [COMMON_SYMBOLS.BTC, 'BPRO', COMMON_SYMBOLS.SOV],
        false,
        false,
      ),
    ],
    [
      COMMON_SYMBOLS.BTC,
      new LendingPool(
        COMMON_SYMBOLS.BTC,
        [
          COMMON_SYMBOLS.DLLR,
          COMMON_SYMBOLS.XUSD,
          COMMON_SYMBOLS.SOV,
          'BPRO',
          COMMON_SYMBOLS.DOC,
        ],
        false,
        false,
      ),
    ],
    [
      COMMON_SYMBOLS.XUSD,
      new LendingPool(
        COMMON_SYMBOLS.XUSD,
        [COMMON_SYMBOLS.BTC, 'BPRO', COMMON_SYMBOLS.SOV],
        true,
        false,
      ),
    ],
    [
      COMMON_SYMBOLS.DOC,
      new LendingPool(
        COMMON_SYMBOLS.DOC,
        [COMMON_SYMBOLS.BTC, COMMON_SYMBOLS.XUSD, 'BPRO', COMMON_SYMBOLS.SOV],
        false,
        false,
      ),
    ],
    [
      COMMON_SYMBOLS.RUSDT,
      new LendingPool(COMMON_SYMBOLS.RUSDT, [], false, true),
    ],
    [
      'BPRO',
      new LendingPool(
        'BPRO',
        [
          COMMON_SYMBOLS.DLLR,
          COMMON_SYMBOLS.BTC,
          COMMON_SYMBOLS.XUSD,
          COMMON_SYMBOLS.DOC,
          COMMON_SYMBOLS.SOV,
        ],
        false,
        false,
      ),
    ],
  ]);

  public static get(asset: string): LendingPool {
    return this.pools.get(asset) as LendingPool;
  }

  public static list(): Array<LendingPool> {
    return Array.from(this.pools.values());
  }

  public static assetList(): Array<string> {
    return Array.from(this.pools.keys());
  }

  public static find(assets: Array<string>): Array<LendingPool> {
    return assets.map(asset => this.get(asset));
  }

  public static entries() {
    return Array.from(this.pools.entries());
  }
}
