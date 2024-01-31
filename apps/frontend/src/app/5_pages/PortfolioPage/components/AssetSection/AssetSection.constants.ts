import { SupportedTokens } from '@sovryn/contracts';
import { Decimal } from '@sovryn/utils';

export const availableTokens = [
  SupportedTokens.rbtc,
  SupportedTokens.sov,
  SupportedTokens.dllr,
  SupportedTokens.xusd,
  SupportedTokens.fish,
  SupportedTokens.moc,
  SupportedTokens.rif,
  SupportedTokens.doc,
  SupportedTokens.zusd,
  SupportedTokens.mynt,
  SupportedTokens.bpro,
  SupportedTokens.rusdt,
  SupportedTokens.bnbs,
  SupportedTokens.eths,
];

export const initialUsdValues = availableTokens.reduce(
  (obj, token) => ({ ...obj, [token]: Decimal.ZERO }),
  {},
);
