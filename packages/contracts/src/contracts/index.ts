import { loanTokens } from './loan-tokens';
import { protocol } from './protocol';
import { tokens } from './tokens';
import { zero } from './zero';

export const contracts = {
  tokens,
  loanTokens,
  protocol,
  zero,
} as const;
