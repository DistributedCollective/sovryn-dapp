import type { SupportedTokens } from '@sovryn/contracts';
import type { SelectOption } from '@sovryn/ui';

export const tokensToOptions = (
  tokens: SupportedTokens[],
): SelectOption<SupportedTokens>[] =>
  tokens.map(token => ({
    value: token,
    label: token.toUpperCase(),
  }));
