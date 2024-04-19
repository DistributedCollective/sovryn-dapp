import { ChainIds } from '@sovryn/ethers-provider';

import { BOB_CHAIN_ID } from '../../../../../config/chains';

import { AmbientLiquidityPool } from './utils/AmbientLiquidityPool';

export const TESTNET_AMM = [
  // BOB
  new AmbientLiquidityPool('ETH', 'SOV', BOB_CHAIN_ID, '36000'),
  new AmbientLiquidityPool('ETH', 'USDT', BOB_CHAIN_ID, '36000'),
  new AmbientLiquidityPool('ETH', 'USDC', BOB_CHAIN_ID, '36000'),
  new AmbientLiquidityPool('ETH', 'DAI', BOB_CHAIN_ID, '36000'),
  // SEPOLIA
  new AmbientLiquidityPool(
    'ETH',
    'SOV',
    ChainIds.SEPOLIA,
    '36000',
    '0xcEEA3981b22075B4a66C4f1185094E8240F4534F',
  ),
  new AmbientLiquidityPool('ETH', 'USDT', ChainIds.SEPOLIA, '36000'),
  new AmbientLiquidityPool('ETH', 'USDC', ChainIds.SEPOLIA, '36000'),
  new AmbientLiquidityPool('ETH', 'DAI', ChainIds.SEPOLIA, '36000'),
  new AmbientLiquidityPool('ETH', 'VCT', ChainIds.SEPOLIA, '36000'),
  // Virtual
  new AmbientLiquidityPool('ETH', 'SOV', ChainIds.FORK, '36000'),
  new AmbientLiquidityPool('ETH', 'USDT', ChainIds.FORK, '36000'),
  new AmbientLiquidityPool('ETH', 'USDC', ChainIds.FORK, '36000'),
  new AmbientLiquidityPool('ETH', 'DAI', ChainIds.FORK, '36000'),
];
