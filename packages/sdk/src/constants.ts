import { SupportedTokens } from '@sovryn/contracts';

// Default slippage for swap, 10_000 = 100%.
export const DEFAULT_SWAP_SLIPPAGE = 100; // 1%

export const STABLECOINS: SupportedTokens[] = [
  COMMON_SYMBOLS.ZUSD,
  COMMON_SYMBOLS.DLLR,
  COMMON_SYMBOLS.XUSD,
  'DOC',
  'RUSDT',
];
