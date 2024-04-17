import { ChainId } from '@sovryn/ethers-provider';

import { TESTNET_AMM } from '../AmbientMarketMaking.constants';
import { AmbientLiquidityPool } from './AmbientLiquidityPool';

export class AmbientLiquidityPoolDictionary {
  private static items: AmbientLiquidityPool[] = [...TESTNET_AMM];

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
        (item.base === base && item.quote === quote) ||
        (item.quote === quote && item.base === base),
    ) as AmbientLiquidityPool;
  }
}
