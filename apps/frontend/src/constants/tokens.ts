import { SupportedTokens } from '@sovryn/contracts';

export const tokensDisplayName = {
  [SupportedTokens.bnbs]: 'BNB',
  [SupportedTokens.rbtc]: 'BTC',
  [SupportedTokens.eths]: 'ETH',
  [SupportedTokens.fish]: 'FISH',
  [SupportedTokens.wrbtc]: 'BTC',
};

export const getTokenDisplayName = (token: SupportedTokens | string): string =>
  tokensDisplayName[token?.toLowerCase()] || token?.toUpperCase();
