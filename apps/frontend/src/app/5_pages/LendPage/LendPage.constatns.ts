import { SupportedTokens } from '@sovryn/contracts';

export const borrowCollaterals = {
  [SupportedTokens.dllr]: [
    SupportedTokens.rbtc,
    SupportedTokens.bpro,
    SupportedTokens.sov,
  ],
  [SupportedTokens.rbtc]: [
    SupportedTokens.dllr,
    SupportedTokens.xusd,
    SupportedTokens.doc,
    SupportedTokens.bpro,
    SupportedTokens.sov,
  ],
  [SupportedTokens.xusd]: [
    SupportedTokens.rbtc,
    SupportedTokens.bpro,
    SupportedTokens.sov,
  ],
  [SupportedTokens.doc]: [
    SupportedTokens.rbtc,
    SupportedTokens.xusd,
    SupportedTokens.bpro,
    SupportedTokens.sov,
  ],
  [SupportedTokens.bpro]: [
    SupportedTokens.dllr,
    SupportedTokens.rbtc,
    SupportedTokens.xusd,
    SupportedTokens.doc,
    SupportedTokens.sov,
  ],
};
