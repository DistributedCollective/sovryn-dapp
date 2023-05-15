import { SupportedTokens, TokenBaseInfo } from '../types';

export const SupportedTokenList: TokenBaseInfo[] = [
  {
    symbol: SupportedTokens.rbtc,
    decimalPrecision: 18,
    getIcon: async () => (await import('../tokenDetails/logos/rbtc')).default,
  },
  {
    symbol: SupportedTokens.wrbtc,
    decimalPrecision: 18,
    getIcon: async () => (await import('../tokenDetails/logos/rbtc')).default,
  },
  {
    symbol: SupportedTokens.zusd,
    decimalPrecision: 18,
    getIcon: async () => (await import('../tokenDetails/logos/zusd')).default,
  },
  {
    symbol: SupportedTokens.xusd,
    decimalPrecision: 18,
    getIcon: async () => (await import('../tokenDetails/logos/xusd')).default,
  },
  {
    symbol: SupportedTokens.dllr,
    decimalPrecision: 18,
    getIcon: async () => (await import('../tokenDetails/logos/dllr')).default,
  },
  {
    symbol: SupportedTokens.sov,
    decimalPrecision: 18,
    getIcon: async () => (await import('../tokenDetails/logos/sov')).default,
  },
  {
    symbol: SupportedTokens.doc,
    decimalPrecision: 18,
    getIcon: async () => (await import('../tokenDetails/logos/doc')).default,
  },
  {
    symbol: SupportedTokens.mynt,
    decimalPrecision: 18,
    getIcon: async () => (await import('../tokenDetails/logos/mynt')).default,
  },
];
