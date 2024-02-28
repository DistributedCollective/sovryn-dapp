import { SupportedTokens } from '@sovryn/contracts';

import { rskChainId } from '../../../../config/chains';

import { MAINNET_AMM, TESTNET_AMM } from '../MarketMakingPage.constants';
import { AmmLiquidityPool } from './AmmLiquidityPool';

export class AmmLiquidityPoolDictionary {
  private static items: AmmLiquidityPool[] = [...MAINNET_AMM, ...TESTNET_AMM];

  public static list(): AmmLiquidityPool[] {
    return this.items.filter(item => item.chainId === rskChainId);
  }

  public static get(converter: string): AmmLiquidityPool;
  public static get(
    assetA: SupportedTokens,
    assetB: SupportedTokens,
  ): AmmLiquidityPool;
  public static get(poolTokenA: string): AmmLiquidityPool;

  public static get(
    converterOrAssetA: SupportedTokens | string,
    assetB?: SupportedTokens,
  ): AmmLiquidityPool {
    if (assetB) {
      return this.list().find(
        item =>
          (item.assetA === converterOrAssetA && item.assetB === assetB) ||
          (item.assetB === converterOrAssetA && item.assetA === assetB),
      ) as AmmLiquidityPool;
    }
    return this.list().find(
      item =>
        item.converter === converterOrAssetA.toLowerCase() ||
        item.previousConverters.includes(
          converterOrAssetA.toLocaleLowerCase(),
        ) ||
        item.poolTokenA.toLowerCase() === converterOrAssetA.toLowerCase(),
    ) as AmmLiquidityPool;
  }

  public static getByKey(key: string): AmmLiquidityPool {
    return this.list().find(item => item.key === key) as AmmLiquidityPool;
  }
}
