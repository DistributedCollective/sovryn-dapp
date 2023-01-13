import { SupportedTokenList, SupportedTokens } from '@sovryn/contracts';
import { SelectOption } from '@sovryn/ui';

export const bassets = [SupportedTokens.zusd, SupportedTokens.doc];
export const masset = SupportedTokens.dllr;

const allowedTokens = [...bassets, masset];

export const tokenOptions: SelectOption<SupportedTokens>[] =
  SupportedTokenList.filter(item => allowedTokens.includes(item.symbol)).map(
    token => ({
      value: token.symbol,
      label: token.symbol.toUpperCase(),
    }),
  );
