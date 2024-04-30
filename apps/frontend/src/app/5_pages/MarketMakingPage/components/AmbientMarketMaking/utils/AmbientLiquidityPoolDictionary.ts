import { ChainId } from '@sovryn/ethers-provider';

import { AmbientLiquidityPool } from './AmbientLiquidityPool';
import { bobMainnet } from './pools/bobMainnet';
import { bobTestnet } from './pools/bobTestnet';
import { mockBobMainnet } from './pools/mockBobMainnet';

export class AmbientLiquidityPoolDictionary {
  private static items: AmbientLiquidityPool[] = [
    ...bobMainnet,
    ...bobTestnet,
    ...mockBobMainnet, // todo: remove
    // ...sepolia,
  ];

  public static list(chainId: ChainId): AmbientLiquidityPool[] {
    return this.items.filter(item => item.chainId === chainId);
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
        (item.base.toLowerCase() === base.toLowerCase() &&
          item.quote.toLowerCase() === quote.toLowerCase()) ||
        (item.quote.toLowerCase() === quote.toLowerCase() &&
          item.base.toLowerCase() === base.toLowerCase()),
    ) as AmbientLiquidityPool;
  }
}
