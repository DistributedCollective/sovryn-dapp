import { SupportedTokenList, SupportedTokens } from '@sovryn/contracts';
import { SelectOption } from '@sovryn/ui';

const allowedTokens = [SupportedTokens.zusd, SupportedTokens.dllr];

export const tokenOptions: SelectOption<SupportedTokens>[] =
  SupportedTokenList.filter(item => allowedTokens.includes(item.symbol)).map(
    token => ({
      value: token.symbol,
      label: token.symbol.toUpperCase(),
    }),
  );
