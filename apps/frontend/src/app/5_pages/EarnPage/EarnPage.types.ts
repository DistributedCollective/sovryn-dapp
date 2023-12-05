import { TokenBaseInfo } from '@sovryn/contracts';
import { SupportedTokenList, SupportedTokens } from '@sovryn/contracts';

const allowedTokens = [SupportedTokens.zusd /*, SupportedTokens.dllr*/];

export const tokenList: TokenBaseInfo[] = SupportedTokenList.filter(item =>
  allowedTokens.includes(item.symbol),
);
