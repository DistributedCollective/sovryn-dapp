import { SupportedTokens } from '@sovryn/contracts';

import { decimalic } from '../../../utils/math';

export const getCollateralAssetPrice = (
  collateralToken: SupportedTokens,
  debtToken: SupportedTokens,
  rbtcPrice: string,
  collateralPriceUsd: string,
  borrowPriceUsd: string,
) =>
  decimalic(
    collateralToken === SupportedTokens.rbtc ? rbtcPrice : collateralPriceUsd,
  )
    .div(debtToken === SupportedTokens.rbtc ? rbtcPrice : borrowPriceUsd)
    .toString();
