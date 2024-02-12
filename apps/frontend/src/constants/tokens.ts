import { SupportedTokens } from '@sovryn/contracts';

import { isBitpro, isBtcBasedAsset } from '../utils/helpers';

export const tokensDisplayName = {
  [SupportedTokens.bnbs]: 'BNB',
  [SupportedTokens.rbtc]: 'BTC',
  [SupportedTokens.eths]: 'ETH',
  [SupportedTokens.fish]: 'FISH',
};

export const getTokenDisplayName = (
  token: SupportedTokens | string,
): string => {
  if (isBtcBasedAsset(token)) {
    token = SupportedTokens.rbtc;
  }

  if (isBitpro(token)) {
    token = SupportedTokens.bpro;
  }
  return tokensDisplayName[token?.toLowerCase()] || token?.toUpperCase();
};
