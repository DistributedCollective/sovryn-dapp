import { RSK_CHAIN_ID } from '../../../config/chains';
import { COMMON_SYMBOLS, normalizeAsset } from '../../../utils/asset';

const allowedTokens = [COMMON_SYMBOLS.ZUSD, COMMON_SYMBOLS.DLLR];

export const tokenList = allowedTokens.map(item =>
  normalizeAsset(item, RSK_CHAIN_ID),
);
