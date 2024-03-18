import { assets } from './assets';
import { loanTokens } from './loan-tokens';
import { protocol } from './protocol';
import { zero } from './zero';

export const contracts = {
  assets,
  loanTokens,
  protocol,
  zero,
} as const;
