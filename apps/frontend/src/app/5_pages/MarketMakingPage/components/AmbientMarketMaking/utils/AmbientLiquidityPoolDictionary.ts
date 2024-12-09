import { ChainId } from '@sovryn/ethers-provider';

import { AmbientLiquidityPool, PoolListGroup } from './AmbientLiquidityPool';
import { bobMainnet } from './pools/bobMainnet';
import { bobTestnet } from './pools/bobTestnet';

export class AmbientLiquidityPoolDictionary {
  private static items: AmbientLiquidityPool[] = [...bobMainnet, ...bobTestnet];

  public static list(
    chainId: ChainId,
    group?: PoolListGroup,
  ): AmbientLiquidityPool[] {
    return this.items.filter(
      item => item.chainId === chainId && (group ? item.group === group : true),
    );
  }

  public static get(
    base: string,
    quote: string,
    chainId: ChainId,
  ): AmbientLiquidityPool;

  public static get(
    base: string,
    quote: string,
    chainId: ChainId,
  ): AmbientLiquidityPool {
    return this.list(chainId).find(
      item =>
        (item.base?.toLowerCase() === base?.toLowerCase() &&
          item.quote?.toLowerCase() === quote?.toLowerCase()) ||
        (item.quote?.toLowerCase() === quote?.toLowerCase() &&
          item.base?.toLowerCase() === base?.toLowerCase()),
    ) as AmbientLiquidityPool;
  }
}
