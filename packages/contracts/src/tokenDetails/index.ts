import { SupportedTokens, TokenBaseInfo } from '../types';

export const SupportedTokenList: TokenBaseInfo[] = [
  {
    symbol: SupportedTokens.xusd,
    decimalPrecision: 18,
    getIcon: async () => (await import('../tokenDetails/logos/xusd')).default,
  },
  {
    symbol: SupportedTokens.sov,
    decimalPrecision: 18,
    getIcon: async () => (await import('../tokenDetails/logos/sov')).default,
  },
];
