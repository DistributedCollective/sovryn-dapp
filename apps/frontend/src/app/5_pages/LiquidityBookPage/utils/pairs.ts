// src/utils/pairs.ts
import { PairV2 } from '@sovryn/joe-sdk-v2';

import { DAI, SOV, USDT, WBTC } from './tokens';

export const lbPairWBTC_USDT = new PairV2(WBTC, USDT);
export const lbPairUSDT_SOV = new PairV2(USDT, SOV);
export const lbPairSOV_DAI = new PairV2(SOV, DAI);
