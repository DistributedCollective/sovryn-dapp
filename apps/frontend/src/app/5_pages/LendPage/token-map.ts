import { SupportedTokens } from '@sovryn/contracts';

export const loanTokenMap: Partial<Record<SupportedTokens, string>> = {
  [SupportedTokens.xusd]: 'ixusd',
};

export const getLoanTokenName = (token: SupportedTokens) =>
  loanTokenMap.hasOwnProperty(token) ? loanTokenMap[token] : null;
