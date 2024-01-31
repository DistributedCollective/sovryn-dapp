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
  [SupportedTokens.rbtc]: 'Bitcoin',
  [SupportedTokens.sov]: 'Sovryn Token',
  [SupportedTokens.dllr]: 'Sovryn Dollar',
  [SupportedTokens.fish]: 'Babelfish',
  [SupportedTokens.zusd]: 'Zero USD',
  [SupportedTokens.moc]: 'Money On Chain',
  [SupportedTokens.doc]: 'Dollar on Chain',
  [SupportedTokens.rif]: 'RSK Infrastructure Framework',
  [SupportedTokens.bpro]: 'BitPro',
  [SupportedTokens.bnbs]: 'Binance Smart Chain',
  [SupportedTokens.eths]: 'Ethereum',
};

export const getTokenLongName = (token: SupportedTokens | string): string =>
  tokensLongName[token?.toLowerCase()] || getTokenDisplayName(token);
