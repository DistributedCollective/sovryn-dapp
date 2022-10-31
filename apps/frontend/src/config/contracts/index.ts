import tokens from './tokens';
import loanTokens from './loan-tokens';
import protocol from './protocol';

const contracts = {
  tokens,
  loanTokens,
  protocol,
} as const;

export default contracts;
