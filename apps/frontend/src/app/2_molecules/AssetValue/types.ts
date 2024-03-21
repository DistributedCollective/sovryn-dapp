import { SupportedTokens } from '@sovryn/contracts';
import { Decimal } from '@sovryn/utils';

import {
  BTC_RENDER_PRECISION,
  TOKEN_RENDER_PRECISION,
} from '../../../constants/currencies';

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
   * a string that represents the CSS class to apply to the Tooltip component.
   */
  className?: string;
  /**
   * a string that represents the CSS class to apply to the component.
   */
  containerClassName?: string;
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
  [SupportedTokens.btc]: BTC_RENDER_PRECISION,
  [SupportedTokens.usdt]: BTC_RENDER_PRECISION,
  [SupportedTokens.rbtc]: BTC_RENDER_PRECISION,
  [SupportedTokens.zusd]: TOKEN_RENDER_PRECISION,
  [SupportedTokens.xusd]: TOKEN_RENDER_PRECISION,
  [SupportedTokens.dllr]: TOKEN_RENDER_PRECISION,
  [SupportedTokens.sov]: TOKEN_RENDER_PRECISION,
  [SupportedTokens.doc]: TOKEN_RENDER_PRECISION,
  [SupportedTokens.mynt]: TOKEN_RENDER_PRECISION,
  [SupportedTokens.wrbtc]: BTC_RENDER_PRECISION,
  [SupportedTokens.rdoc]: TOKEN_RENDER_PRECISION,
  [SupportedTokens.fish]: TOKEN_RENDER_PRECISION,
  [SupportedTokens.rif]: TOKEN_RENDER_PRECISION,
  [SupportedTokens.bpro]: BTC_RENDER_PRECISION,
  [SupportedTokens.rusdt]: TOKEN_RENDER_PRECISION,
  [SupportedTokens.eths]: TOKEN_RENDER_PRECISION,
  [SupportedTokens.bnbs]: TOKEN_RENDER_PRECISION,
  [SupportedTokens.moc]: TOKEN_RENDER_PRECISION,
};

export enum AssetValueMode {
  predefined = 'predefined',
  auto = 'auto',
}
