import { ContractInterface } from 'ethers';

import { ChainIds } from '@sovryn/ethers-provider';

import LiquidityPoolV1Converter from '../abis/LiquidityPoolV1Converter.json';
import LiquidityPoolV2Converter from '../abis/LiquidityPoolV2Converter.json';

export type ConverterVersion = 1 | 2;

export class AmmLiquidityPool {
  private _hasSovRewards: boolean = true;
  private _previousConverters: string[] = [];

  constructor(
    public readonly assetA: string,
    public readonly assetB: string,
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
  public getPoolTokenAddress(asset: string) {
    asset = asset.toLowerCase();
    if (asset === this.assetA.toLowerCase()) {
      return this.poolTokenA;
    }
    if (asset === this.assetB.toLowerCase()) {
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

  public get converterAbi(): ContractInterface {
    return this.converterVersion === 1
      ? LiquidityPoolV1Converter
      : LiquidityPoolV2Converter;
  }
}
