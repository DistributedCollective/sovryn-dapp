import type { SupportedTokens } from '@sovryn/contracts';
import type { SelectOption } from '@sovryn/ui';

import { getTokenDisplayName } from '../constants/tokens';

export const tokensToOptions = (
  tokens: SupportedTokens[],
): SelectOption<SupportedTokens>[] =>
  tokens.map(token => ({
    value: token,
    label: getTokenDisplayName(token),
  }));
