import { BOB_CHAIN_ID } from '../../../../../../config/chains';

import { TESTNET_AMM } from '../AmbientMarketMaking.constants';
import { AmbientLiquidityPool } from './AmbientLiquidityPool';

export class AmbientLiquidityPoolDictionary {
  private static items: AmbientLiquidityPool[] = [...TESTNET_AMM];

  public static list(): AmbientLiquidityPool[] {
    return this.items.filter(item => item.chainId === BOB_CHAIN_ID);
  }

  public static get(assetA: string, assetB: string): AmbientLiquidityPool;

  public static get(assetA: string, assetB: string): AmbientLiquidityPool {
    return this.list().find(
      item =>
        (item.assetA === assetA && item.assetB === assetB) ||
        (item.assetB === assetB && item.assetA === assetA),
    ) as AmbientLiquidityPool;
  }

  public static getByKey(poolTokenA: string): AmbientLiquidityPool;

  public static getByKey(key: string): AmbientLiquidityPool {
    return this.list().find(item => item.key === key) as AmbientLiquidityPool;
  }
}
