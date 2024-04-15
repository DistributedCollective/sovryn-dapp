import { BOB_CHAIN_ID } from '../../../../../config/chains';

import { AmbientLiquidityPool } from './utils/AmbientLiquidityPool';

export const TESTNET_AMM = [
  new AmbientLiquidityPool('ETH', 'SOV', BOB_CHAIN_ID, '36000'),
  new AmbientLiquidityPool('ETH', 'USDT', BOB_CHAIN_ID, '36000'),
  new AmbientLiquidityPool('ETH', 'USDC', BOB_CHAIN_ID, '36000'),
  new AmbientLiquidityPool('ETH', 'DAI', BOB_CHAIN_ID, '36000'),
];
