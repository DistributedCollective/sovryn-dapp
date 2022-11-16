import { loanTokens } from './loan-tokens';
import { protocol } from './protocol';
import { tokens } from './tokens';

export const contracts = {
  tokens,
  loanTokens,
  protocol,
} as const;
