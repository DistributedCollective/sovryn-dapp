import { SupportedTokens } from '@sovryn/contracts';

// Default slippage for swap, 10_000 = 100%.
export const DEFAULT_SWAP_SLIPPAGE = 100; // 1%

export const STABLECOINS: SupportedTokens[] = [
  SupportedTokens.zusd,
  SupportedTokens.dllr,
  SupportedTokens.xusd,
  SupportedTokens.doc,
  SupportedTokens.rusdt,
];
