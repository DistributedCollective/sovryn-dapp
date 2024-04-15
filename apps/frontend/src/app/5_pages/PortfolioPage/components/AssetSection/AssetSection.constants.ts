import { SupportedTokens } from '@sovryn/contracts';
import { Decimal } from '@sovryn/utils';

export const availableTokens = [
  SupportedTokens.rbtc,
  SupportedTokens.sov,
  SupportedTokens.ossov,
  SupportedTokens.dllr,
  SupportedTokens.zusd,
  SupportedTokens.xusd,
  SupportedTokens.fish,
  SupportedTokens.moc,
  SupportedTokens.rif,
  SupportedTokens.doc,
  SupportedTokens.mynt,
  SupportedTokens.rusdt,
  SupportedTokens.bnbs,
  SupportedTokens.eths,
  SupportedTokens.bpro,
];

export const initialUsdValues = availableTokens.reduce(
  (obj, token) => ({ ...obj, [token]: Decimal.ZERO }),
  {},
);
