import { BigNumber } from 'ethers';

import { ChainId } from '@sovryn/ethers-provider';

import { findAsset } from '../../../../../../utils/asset';

export class AmbientLiquidityPool {
  public readonly baseAddress: string;
  public readonly quoteAddress: string;

  public readonly base;
  public readonly quote;

  constructor(
    _base: string,
    _quote: string,
    public readonly chainId: ChainId,
    public readonly poolIndex: number,
    public readonly lpTokenAddress?: string,
  ) {
    try {
      this.lpTokenAddress = lpTokenAddress
        ? lpTokenAddress.toLowerCase()
        : undefined;

      const _baseAddress = findAsset(_base, chainId).address;
      const _quoteAddress = findAsset(_quote, chainId).address;

      [this.base, this.quote] = BigNumber.from(_baseAddress).lt(_quoteAddress)
        ? [_base, _quote]
        : [_quote, _base];

      [this.baseAddress, this.quoteAddress] = BigNumber.from(_baseAddress).lt(
        _quoteAddress,
      )
        ? [_baseAddress, _quoteAddress]
        : [_quoteAddress, _baseAddress];
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
