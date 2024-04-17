import { BigNumber } from 'ethers';

import { ChainId } from '@sovryn/ethers-provider';

import { getCurrentChain } from '../../../../../../hooks/useChainStore';
import { findAsset } from '../../../../../../utils/asset';

export class AmbientLiquidityPool {
  private _baseAddress: string;
  private _quoteAddress: string;

  public readonly base;
  public readonly quote;

  constructor(
    _base: string,
    _quote: string,
    public readonly _chainId: ChainId, // temporary hidding it
    public readonly poolIdx: string,
  ) {
    const chainId = getCurrentChain();

    this._baseAddress = findAsset(_base, chainId).address;
    this._quoteAddress = findAsset(_quote, chainId).address;

    [this.base, this.quote] = BigNumber.from(this._baseAddress).lt(
      this._quoteAddress,
    )
      ? [_base, _quote]
      : [_quote, _base];
  }

  public get key() {
    return `${this.base}/${this.quote}`;
  }

  public get chainId() {
    return getCurrentChain();
  }
}
