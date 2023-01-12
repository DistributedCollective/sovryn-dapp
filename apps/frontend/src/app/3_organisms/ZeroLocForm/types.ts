import { SupportedTokenList, SupportedTokens } from '@sovryn/contracts';
import type { SelectOption } from '@sovryn/ui';

import { BORROW_ASSETS } from '../../5_pages/ZeroPage/constants';

export enum AmountType {
  Add = 'Add',
  Remove = 'Remove',
}

export const tokens: SelectOption<SupportedTokens>[] =
  SupportedTokenList.filter(item => BORROW_ASSETS.includes(item.symbol)).map(
    token => ({
      value: token.symbol,
      label: token.symbol.toUpperCase(),
    }),
  );
