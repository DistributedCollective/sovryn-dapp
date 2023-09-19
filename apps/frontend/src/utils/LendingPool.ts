import { SupportedTokens, getTokenDetails } from '@sovryn/contracts';

export class LendingPool {
  private _assetDetails;
  constructor(
    private _name: string,
    private _asset: SupportedTokens,
    private _borrowCollateral: SupportedTokens[] = [],
    public readonly useLM: boolean,
    public readonly deprecated: boolean = false,
  ) {
    this._assetDetails = getTokenDetails(this._asset);
  }
  public getName(): string {
    return this._name;
  }
  public getAsset(): SupportedTokens {
    return this._asset;
  }
  public getAssetDetails(): SupportedTokens {
    return this._assetDetails;
  }
  public getBorrowCollateral(): SupportedTokens[] {
    return this._borrowCollateral;
  }
}
