import { ChainIds } from '@sovryn/ethers-provider';

import { BOB_CHAIN_ID } from '../../../../../../config/chains';

import { TESTNET_AMM } from '../AmbientMarketMaking.constants';
import { AmbientLiquidityPool } from './AmbientLiquidityPool';

export class AmbientLiquidityPoolDictionary {
  private static items: AmbientLiquidityPool[] = [...TESTNET_AMM];

  public static list(): AmbientLiquidityPool[] {
    return this.items.filter(
      item =>
        item.chainId === BOB_CHAIN_ID ||
        item.chainId === ChainIds.SEPOLIA ||
        item.chainId === ChainIds.FORK,
    );
  }

  public static get(base: string, quote: string): AmbientLiquidityPool;

  public static get(base: string, quote: string): AmbientLiquidityPool {
    return this.list().find(
      item =>
        (item.base === base && item.quote === quote) ||
        (item.quote === quote && item.base === base),
    ) as AmbientLiquidityPool;
  }

  public static getByKey(poolTokenA: string): AmbientLiquidityPool;

  public static getByKey(key: string): AmbientLiquidityPool {
    return this.list().find(item => item.key === key) as AmbientLiquidityPool;
  }
}
