import { SupportedTokens } from '@sovryn/contracts';

import { isBitpro, isBtcBasedAsset } from '../utils/helpers';

export const tokensDisplayName = {
  [SupportedTokens.bnbs]: 'BNB',
  [SupportedTokens.rbtc]: 'BTC',
  [SupportedTokens.eths]: 'ETH',
  [SupportedTokens.fish]: 'FISH',
};

export const resolveTokenName = (token: SupportedTokens | string): string => {
  if (isBtcBasedAsset(token)) {
    token = SupportedTokens.rbtc;
  }

  if (isBitpro(token)) {
    token = SupportedTokens.bpro;
  }

  return token;
};

export const getTokenDisplayName = (
  token: SupportedTokens | string,
): string => {
  token = resolveTokenName(token);
  return tokensDisplayName[token?.toLowerCase()] || token?.toUpperCase();
};

export const tokensLongName = {
  [SupportedTokens.rbtc]: 'Bitcoin',
  [SupportedTokens.sov]: 'Sovryn Token',
  [SupportedTokens.ossov]: 'Sovryn Token for BitcoinOS',
  [SupportedTokens.dllr]: 'Sovryn Dollar',
  [SupportedTokens.fish]: 'Babelfish',
  [SupportedTokens.zusd]: 'Zero USD',
  [SupportedTokens.moc]: 'Money On Chain',
  [SupportedTokens.doc]: 'Dollar on Chain',
  [SupportedTokens.rif]: 'RSK Infrastructure Framework',
  [SupportedTokens.bpro]: 'BitPro',
  [SupportedTokens.bnbs]: 'Binance Coin',
  [SupportedTokens.eths]: 'Ethereum',
};

export const getTokenLongName = (token: SupportedTokens | string): string => {
  token = resolveTokenName(token);
  return tokensLongName[token?.toLowerCase()] || getTokenDisplayName(token);
};
