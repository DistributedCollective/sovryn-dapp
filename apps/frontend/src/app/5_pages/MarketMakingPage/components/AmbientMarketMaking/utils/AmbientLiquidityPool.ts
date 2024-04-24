import { BigNumber } from 'ethers';

import { ChainId } from '@sovryn/ethers-provider';

import { findAsset } from '../../../../../../utils/asset';

export class AmbientLiquidityPool {
  private _baseAddress: string;
  private _quoteAddress: string;

  public readonly base;
  public readonly quote;

  constructor(
    _base: string,
    _quote: string,
    public readonly chainId: ChainId,
    public readonly poolIdx: string,
    public readonly lpTokenAddress?: string,
  ) {
    try {
      this.lpTokenAddress = lpTokenAddress
        ? lpTokenAddress.toLowerCase()
        : undefined;

      this._baseAddress = findAsset(_base, chainId).address;
      this._quoteAddress = findAsset(_quote, chainId).address;

      [this.base, this.quote] = BigNumber.from(this._baseAddress).lt(
        this._quoteAddress,
      )
        ? [_base, _quote]
        : [_quote, _base];
    } catch (error) {
      console.error(
        'Failed to construct Ambient Liqudity Pool',
        _base,
        _quote,
        chainId,
        error,
      );
      throw error;
    }
  }

  public get key() {
    return `${this.base}/${this.quote}`;
  }
}
