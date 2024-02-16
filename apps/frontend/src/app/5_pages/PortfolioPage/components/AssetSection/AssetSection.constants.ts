import { SupportedTokens } from '@sovryn/contracts';
import { Decimal } from '@sovryn/utils';

export const availableTokens = [
  SupportedTokens.rbtc,
  SupportedTokens.sov,
  SupportedTokens.dllr,
  SupportedTokens.zusd,
  SupportedTokens.xusd,
  SupportedTokens.fish,
  SupportedTokens.moc,
  SupportedTokens.rif,
  SupportedTokens.doc,
];

export const initialUsdValues = availableTokens.reduce(
  (obj, token) => ({ ...obj, [token]: Decimal.ZERO }),
  {},
);
