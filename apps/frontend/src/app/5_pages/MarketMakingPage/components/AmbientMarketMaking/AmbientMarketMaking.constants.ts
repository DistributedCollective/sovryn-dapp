import { BOB_CHAIN_ID } from '../../../../../config/chains';

import { AmbientLiquidityPool } from './utils/AmbientLiquidityPool';

export const TESTNET_AMM = [
  new AmbientLiquidityPool('dllr', 'rbtc', BOB_CHAIN_ID),
];
