import { lendTokens } from './lend-tokens';
import { loanTokens } from './loan-tokens';
import { protocol } from './protocol';
import { tokens } from './tokens';
import { zero } from './zero';

export const contracts = {
  tokens,
  loanTokens,
  lendTokens,
  protocol,
  zero,
} as const;
