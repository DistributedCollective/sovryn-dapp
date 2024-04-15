import { ChainId } from '@sovryn/ethers-provider';

export class AmbientLiquidityPool {
  constructor(
    public readonly base: string,
    public readonly quote: string,
    public readonly chainId: ChainId,
    public readonly poolIdx: string,
  ) {}

  public get key() {
    return `${this.base}/${this.quote}`;
  }
}
