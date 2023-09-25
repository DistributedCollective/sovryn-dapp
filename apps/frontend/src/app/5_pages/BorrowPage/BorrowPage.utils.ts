import { SupportedTokens } from '@sovryn/contracts';

import { BITCOIN } from '../../../constants/currencies';

export const isBtcBasedAsset = (asset: string) =>
  asset.toLowerCase() === SupportedTokens.rbtc ||
  asset.toLowerCase() === SupportedTokens.wrbtc ||
  asset.toUpperCase() === BITCOIN;

export const isBitpro = (asset: string) =>
  asset.toLowerCase() === 'bitpro' ||
  asset.toLowerCase() === 'bitp' ||
  asset.toLowerCase() === SupportedTokens.bpro;
