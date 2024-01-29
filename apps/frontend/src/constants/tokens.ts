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

export const tokensLongName = {
  [SupportedTokens.dllr]: 'Sovryn Dollar',
  [SupportedTokens.fish]: 'Babelfish',
  [SupportedTokens.moc]: 'Money On Chain',
  [SupportedTokens.doc]: 'Dollar on Chain',
};

export const getTokenLongName = (token: SupportedTokens | string): string =>
  tokensLongName[token?.toLowerCase()] || getTokenDisplayName(token);
