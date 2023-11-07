import { SupportedTokens } from '@sovryn/contracts';
import { ChainIds } from '@sovryn/ethers-provider';

import { PromotionColor } from '../MarketMakingPage.types';

export type ConverterVersion = 1 | 2;

export class AmmLiquidityPool {
  private _promotionColor?: PromotionColor | string;
  private _hasSovRewards: boolean = true;
  private _previousConverters: string[] = [];

  constructor(
    public readonly assetA: SupportedTokens,
    public readonly assetB: SupportedTokens,
    public readonly converterVersion: ConverterVersion,
    public readonly chainId: ChainIds,
    public readonly converter: string,
    public readonly poolTokenA: string,
    public readonly poolTokenB?: string,
  ) {
    if (converterVersion === 2 && !poolTokenB) {
      throw new Error(
        `V2 pools must have "poolTokenB" property defined! (${assetA}/${assetB})`,
      );
    }
    if (converterVersion === 1 && poolTokenB) {
      throw new Error(
        `V1 pools does not need to have "poolTokenB" property defined! (${assetA}/${assetB})`,
      );
    }
    this.converter = converter.toLowerCase();
    this.poolTokenA = poolTokenA.toLowerCase();
    if (poolTokenB) {
      this.poolTokenB = poolTokenB.toLowerCase();
    }
  }
  public setPromotionColor(color: PromotionColor | string) {
    this._promotionColor = color;
    return this;
  }
  public get lootDropColor() {
    return this._promotionColor;
  }
  public getPoolTokenAddress(asset: SupportedTokens) {
    if (asset === this.assetA) {
      return this.poolTokenA;
    }
    if (asset === this.assetB) {
      return this.poolTokenB;
    }
    return undefined;
  }
  public get hasSovRewards() {
    return this._hasSovRewards;
  }
  public setSovRewards(flag: boolean) {
    this._hasSovRewards = flag;
    return this;
  }
  public getPoolTokenAsset(address: string) {
    address = address.toLowerCase();
    if (address === this.poolTokenA) {
      return this.assetA;
    }
    if (address === this.poolTokenB) {
      return this.assetB;
    }
    return undefined;
  }
  public setPreviousConverters(converters: string[]) {
    this._previousConverters = converters.map(item => item.toLowerCase());
    return this;
  }
  public get previousConverters() {
    return this._previousConverters;
  }

  public get key() {
    return `${this.assetA}/${this.assetB}`;
  }
}
