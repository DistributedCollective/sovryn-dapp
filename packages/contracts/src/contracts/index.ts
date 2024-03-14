import { assets } from './assets';
import { lendTokens } from './lend-tokens';
import { loanTokens } from './loan-tokens';
import { protocol } from './protocol';
import { zero } from './zero';

export const contracts = {
  assets,
  loanTokens,
  lendTokens,
  protocol,
  zero,
} as const;
