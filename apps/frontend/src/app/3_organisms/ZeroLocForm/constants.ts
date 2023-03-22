import { SupportedTokens } from '@sovryn/contracts';

import { decimalic } from '../../../utils/math';

export const CRITICAL_COLLATERAL_RATIO = decimalic(1.5); // 150%
export const MINIMUM_COLLATERAL_RATIO = decimalic(1.1); // 110%

export const MIN_DEBT_SIZE = decimalic(200); // 200 ZUSD

export const DEBT_TOKEN = SupportedTokens.zusd;
export const COLLATERAL_TOKEN = SupportedTokens.rbtc;

export const BTC_RENDER_PRECISION = 8;
export const TOKEN_RENDER_PRECISION = 4;
