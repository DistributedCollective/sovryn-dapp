import { SupportedTokens } from '@sovryn/contracts';

export const CRITICAL_COLLATERAL_RATIO = 1.5; // 150%
export const MINIMUM_COLLATERAL_RATIO = 1.1; // 110%

export const MIN_DEBT_SIZE = 200; // 200 ZUSD

export const DEBT_TOKEN = SupportedTokens.zusd;
export const COLLATERAL_TOKEN = SupportedTokens.rbtc;

export const BTC_TRUNCATE_COUNT = 8;
export const ASSET_TRUNCATE_COUNT = 4;
