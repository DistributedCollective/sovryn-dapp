import { ChainId } from '@sovryn/ethers-provider';

import { findAsset } from '../../../../../../utils/asset';

export class AmbientLiquidityPool {
  public readonly baseAddress: string;
  public readonly quoteAddress: string;

  public readonly base;
  public readonly quote;

  constructor(
    tokenA: string,
    tokenB: string,
    public readonly chainId: ChainId,
    public readonly poolIndex: number,
    public readonly lpTokenAddress?: string,
  ) {
    try {
      this.lpTokenAddress = lpTokenAddress
        ? lpTokenAddress.toLowerCase()
        : undefined;

      const tokenAAddress = findAsset(tokenA, chainId).address;
      const tokenBAddress = findAsset(tokenB, chainId).address;

      const isABase = tokenAAddress.toLowerCase() < tokenBAddress.toLowerCase();

      [this.base, this.quote] = isABase ? [tokenA, tokenB] : [tokenB, tokenA];

      [this.baseAddress, this.quoteAddress] = isABase
        ? [tokenAAddress, tokenBAddress]
        : [tokenBAddress, tokenAAddress];
    } catch (error) {
      console.error(
        'Failed to construct Ambient Liqudity Pool',
        tokenA,
        tokenB,
        chainId,
        error,
      );
      throw error;
    }
  }

  public get key() {
    return `${this.base}wtf/${this.quote}`;
  }
}
