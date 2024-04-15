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
    symbol: SupportedTokens.ossov,
    decimalPrecision: 18,
    getIcon: async () => (await import('../tokenDetails/logos/sov')).default,
  },
  {
    symbol: SupportedTokens.doc,
    decimalPrecision: 18,
    getIcon: async () => (await import('../tokenDetails/logos/doc')).default,
  },
  {
    symbol: SupportedTokens.bnbs,
    decimalPrecision: 18,
    getIcon: async () => (await import('../tokenDetails/logos/bnbs')).default,
  },
  {
    symbol: SupportedTokens.eths,
    decimalPrecision: 18,
    getIcon: async () => (await import('../tokenDetails/logos/eths')).default,
  },
  {
    symbol: SupportedTokens.fish,
    decimalPrecision: 18,
    getIcon: async () => (await import('../tokenDetails/logos/fish')).default,
  },
  {
    symbol: SupportedTokens.moc,
    decimalPrecision: 18,
    getIcon: async () => (await import('../tokenDetails/logos/moc')).default,
  },
  {
    symbol: SupportedTokens.rif,
    decimalPrecision: 18,
    getIcon: async () => (await import('../tokenDetails/logos/rif')).default,
  },
  {
    symbol: SupportedTokens.bpro,
    decimalPrecision: 18,
    getIcon: async () => (await import('../tokenDetails/logos/bpro')).default,
  },
  {
    symbol: SupportedTokens.rusdt,
    decimalPrecision: 18,
    getIcon: async () => (await import('../tokenDetails/logos/rusdt')).default,
  },
  {
    symbol: SupportedTokens.mynt,
    decimalPrecision: 18,
    getIcon: async () => (await import('../tokenDetails/logos/mynt')).default,
  },
];
