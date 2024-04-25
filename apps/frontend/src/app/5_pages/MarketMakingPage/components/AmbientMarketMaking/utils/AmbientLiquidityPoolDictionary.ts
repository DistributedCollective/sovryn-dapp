import { ChainId } from '@sovryn/ethers-provider';

import { MAINNET_AMM, TESTNET_AMM } from '../AmbientMarketMaking.constants';
import { AmbientLiquidityPool } from './AmbientLiquidityPool';

export class AmbientLiquidityPoolDictionary {
  private static items: AmbientLiquidityPool[] = [
    ...MAINNET_AMM,
    ...TESTNET_AMM,
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
