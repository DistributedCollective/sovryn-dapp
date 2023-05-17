import { SupportedTokens } from '@sovryn/contracts';
import { Decimal } from '@sovryn/utils';

export type AssetValueProps = {
  /**
   * a number or string that represents the value of the asset.
   */
  value: Decimal;
  /**
   * an enum value that represents the supported token for the asset. The enum values are defined elsewhere in the codebase.
   */
  asset?: SupportedTokens;
  /**
   * a boolean value that indicates whether or not to display the asset value in a tooltip.
   */
  useTooltip?: boolean;
  /**
   * an enum value that indicates the mode of the asset value. The enum values are defined elsewhere in the codebase.
   */
  mode?: AssetValueMode;
  /**
   * a number that indicates the minimum number of decimal places to display in the asset value.
   */
  minDecimals?: number;
  /**
   * a number that indicates the maximum number of decimal places to display in the asset value.
   */
  maxDecimals?: number;
  /**
   * a string that represents the CSS class to apply to the component.
   */
  className?: string;
  /**
   * a string that represents the CSS class to apply to the asset element.
   */
  assetClassName?: string;
  /**
   * a boolean value that indicates whether or not the asset value is an approximation.
   */
  isApproximation?: boolean;
  /**
   * a boolean value that indicates whether or not to display a plus sign for positive asset values.
   */
  showPositiveSign?: boolean;
  /**
   * a boolean value that indicates whether or not to display a minus sign for negative asset values.
   */
  showNegativeSign?: boolean;
  /**
   * a boolean value that indicates whether or not to display the logo for the asset.
   */
  showAssetLogo?: boolean;
  /**
   * a string that represents a custom data attribute to apply to the component.
   */
  dataAttribute?: string;
};

export const AssetDecimals: { [key in SupportedTokens]: number } = {
  [SupportedTokens.rbtc]: 8,
  [SupportedTokens.zusd]: 4,
  [SupportedTokens.xusd]: 4,
  [SupportedTokens.dllr]: 4,
  [SupportedTokens.sov]: 4,
  [SupportedTokens.doc]: 4,
  [SupportedTokens.mynt]: 4,
  [SupportedTokens.wrbtc]: 8,
  [SupportedTokens.rdoc]: 4,
  [SupportedTokens.fish]: 6,
  [SupportedTokens.rif]: 6,
  [SupportedTokens.bpro]: 8,
  [SupportedTokens.rusdt]: 4,
  [SupportedTokens.eths]: 6,
  [SupportedTokens.bnbs]: 6,
  [SupportedTokens.moc]: 6,
};

export enum AssetValueMode {
  predefined = 'predefined',
  auto = 'auto',
}
