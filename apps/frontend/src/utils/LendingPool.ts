import { AssetDetails } from '@sovryn/contracts';

import { RSK_CHAIN_ID } from '../config/chains';

import { findAsset } from './asset';

export class LendingPool {
  private _details: AssetDetails;
  constructor(
    private _asset: string,
    private _borrowCollateral: string[] = [],
    public readonly useLM: boolean,
    public readonly deprecated: boolean = false,
  ) {
    this._details = findAsset(this._asset, RSK_CHAIN_ID);
  }
  public getName(): string {
    return this._details.symbol;
  }
  public getAsset(): string {
    return this._details.symbol;
  }
  public getAssetDetails(): AssetDetails {
    return this._details;
  }
  public getBorrowCollateral(): string[] {
    return this._borrowCollateral;
  }
}
