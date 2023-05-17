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
  rbtc: 8,
  zusd: 4,
  xusd: 4,
  dllr: 4,
  sov: 4,
  doc: 4,
  bnbs: 4,
  eths: 4,
  fish: 4,
  moc: 4,
  rif: 4,
  bpro: 8,
  rusdt: 4,
};

export enum AssetValueMode {
  predefined = 'predefined',
  auto = 'auto',
}
