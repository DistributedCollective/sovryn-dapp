import { SupportedTokenList, SupportedTokens } from '@sovryn/contracts';
import type { SelectOption } from '@sovryn/ui';

export enum AmountType {
  Add = 'Add',
  Remove = 'Remove',
}

export const tokens: SelectOption<SupportedTokens>[] = SupportedTokenList.map(
  token => ({
    value: token.symbol,
    label: token.symbol.toUpperCase(),
  }),
);
