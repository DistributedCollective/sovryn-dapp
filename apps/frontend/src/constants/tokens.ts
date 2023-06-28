import { SupportedTokens } from '@sovryn/contracts';

export const tokensDisplayName = {
  [SupportedTokens.bnbs]: 'BNB',
  [SupportedTokens.rbtc]: 'BTC',
  [SupportedTokens.eths]: 'ETH',
  [SupportedTokens.fish]: 'FISH',
};

export const getTokenDisplayName = (token: SupportedTokens): string =>
  tokensDisplayName[token] || token.toUpperCase();
