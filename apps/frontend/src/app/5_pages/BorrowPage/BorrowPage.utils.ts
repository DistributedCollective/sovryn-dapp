import { SupportedTokens } from '@sovryn/contracts';

import { BITCOIN } from '../../../constants/currencies';
import { decimalic } from '../../../utils/math';

export const isBtcBasedAsset = (asset: string) =>
  asset.toLowerCase() === SupportedTokens.rbtc ||
  asset.toLowerCase() === SupportedTokens.wrbtc ||
  asset.toUpperCase() === BITCOIN;

export const isBitpro = (asset: string) =>
  asset.toLowerCase() === 'bitpro' ||
  asset.toLowerCase() === 'bitp' ||
  asset.toLowerCase() === SupportedTokens.bpro;

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
