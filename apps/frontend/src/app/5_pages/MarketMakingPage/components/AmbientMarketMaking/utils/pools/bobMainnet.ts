import { ChainIds } from '@sovryn/ethers-provider';

import { AmbientLiquidityPool } from '../AmbientLiquidityPool';

export const bobMainnet: AmbientLiquidityPool[] = [
  new AmbientLiquidityPool('USDC', 'USDT', ChainIds.BOB_MAINNET, 400, ''),
  new AmbientLiquidityPool('DAI', 'DLLR', ChainIds.BOB_MAINNET, 400, ''),
  new AmbientLiquidityPool('USDT', 'DLLR', ChainIds.BOB_MAINNET, 400, ''),
  new AmbientLiquidityPool('TBTC', 'WBTC', ChainIds.BOB_MAINNET, 400, ''),
  new AmbientLiquidityPool('RETH', 'ETH', ChainIds.BOB_MAINNET, 400, ''),
  new AmbientLiquidityPool('WSTETH', 'ETH', ChainIds.BOB_MAINNET, 400, ''),
  new AmbientLiquidityPool('DLLR', 'SOV', ChainIds.BOB_MAINNET, 410, ''),
  new AmbientLiquidityPool('USDT', 'SOV', ChainIds.BOB_MAINNET, 410, ''),
  new AmbientLiquidityPool('USDC', 'SOV', ChainIds.BOB_MAINNET, 410, ''),
  new AmbientLiquidityPool('DAI', 'SOV', ChainIds.BOB_MAINNET, 410, ''),
  new AmbientLiquidityPool('ETH', 'SOV', ChainIds.BOB_MAINNET, 410, ''),
  new AmbientLiquidityPool('WSTETH', 'SOV', ChainIds.BOB_MAINNET, 410, ''),
  new AmbientLiquidityPool('RETH', 'SOV', ChainIds.BOB_MAINNET, 410, ''),
  new AmbientLiquidityPool('WBTC', 'SOV', ChainIds.BOB_MAINNET, 410, ''),
  new AmbientLiquidityPool('TBTC', 'SOV', ChainIds.BOB_MAINNET, 410, ''),
  new AmbientLiquidityPool('POWA', 'SOV', ChainIds.BOB_MAINNET, 420, ''),
];
