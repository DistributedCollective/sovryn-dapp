import { ChainId } from '@sovryn/ethers-provider';

export class AmbientLiquidityPool {
  constructor(
    public readonly assetA: string,
    public readonly assetB: string,
    public readonly chainId: ChainId,
  ) {}

  public get key() {
    return `${this.assetA}/${this.assetB}`;
  }
}
