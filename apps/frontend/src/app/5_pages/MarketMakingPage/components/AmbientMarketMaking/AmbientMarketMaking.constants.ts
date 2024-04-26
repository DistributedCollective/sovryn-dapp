import { ChainIds } from '@sovryn/ethers-provider';

import { AmbientLiquidityPool } from './utils/AmbientLiquidityPool';

export const MAINNET_AMM = [
  // BOB mock pools
  new AmbientLiquidityPool('USDC', 'USDT', ChainIds.BOB_MAINNET, 400),
  new AmbientLiquidityPool('DAI', 'DLLR', ChainIds.BOB_MAINNET, 400),
  new AmbientLiquidityPool('USDT', 'DLLR', ChainIds.BOB_MAINNET, 400),
  new AmbientLiquidityPool('TBTC', 'WBTC', ChainIds.BOB_MAINNET, 400),
  new AmbientLiquidityPool('RETH', 'ETH', ChainIds.BOB_MAINNET, 400),
  new AmbientLiquidityPool('WSTETH', 'ETH', ChainIds.BOB_MAINNET, 400),
  new AmbientLiquidityPool('DLLR', 'SOV', ChainIds.BOB_MAINNET, 400),
  new AmbientLiquidityPool('ETH', 'SOV', ChainIds.BOB_MAINNET, 400),
  new AmbientLiquidityPool('POWA', 'SOV', ChainIds.BOB_MAINNET, 400),
];

export const TESTNET_AMM = [
  // Sepolia
  new AmbientLiquidityPool('USDC', 'USDT', ChainIds.SEPOLIA, 36000),
  new AmbientLiquidityPool('DAI', 'DLLR', ChainIds.SEPOLIA, 36000),
  new AmbientLiquidityPool('USDT', 'DLLR', ChainIds.SEPOLIA, 36000),
  new AmbientLiquidityPool('TBTC', 'WBTC', ChainIds.SEPOLIA, 36000),
  new AmbientLiquidityPool('RETH', 'ETH', ChainIds.SEPOLIA, 36000),
  new AmbientLiquidityPool('WSTETH', 'ETH', ChainIds.SEPOLIA, 36000),
  new AmbientLiquidityPool('DLLR', 'SOV', ChainIds.SEPOLIA, 36000),
  new AmbientLiquidityPool('WBTC', 'SOV', ChainIds.SEPOLIA, 36000),
  new AmbientLiquidityPool('ETH', 'SOV', ChainIds.SEPOLIA, 36000),
  // new AmbientLiquidityPool('POWA', 'SOV', ChainIds.SEPOLIA, 36000),
  // BOB
  new AmbientLiquidityPool('USDC', 'USDT', ChainIds.BOB_TESTNET, 36000),
  new AmbientLiquidityPool('DAI', 'DLLR', ChainIds.BOB_TESTNET, 36000),
  new AmbientLiquidityPool('USDT', 'DLLR', ChainIds.BOB_TESTNET, 36000),
  new AmbientLiquidityPool('TBTC', 'WBTC', ChainIds.BOB_TESTNET, 36000),
  new AmbientLiquidityPool('RETH', 'ETH', ChainIds.BOB_TESTNET, 36000),
  new AmbientLiquidityPool('WSTETH', 'ETH', ChainIds.BOB_TESTNET, 36000),
  new AmbientLiquidityPool('DLLR', 'SOV', ChainIds.BOB_TESTNET, 36000),
  new AmbientLiquidityPool('WBTC', 'SOV', ChainIds.BOB_TESTNET, 36000),
  new AmbientLiquidityPool('ETH', 'SOV', ChainIds.BOB_TESTNET, 36000),
  new AmbientLiquidityPool('POWA', 'SOV', ChainIds.BOB_TESTNET, 36000),
];
