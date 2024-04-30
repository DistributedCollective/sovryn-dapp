import { ChainIds } from '@sovryn/ethers-provider';

import { AmbientLiquidityPool } from '../AmbientLiquidityPool';

export const bobTestnet: AmbientLiquidityPool[] = [
  // Bob Testnet
  new AmbientLiquidityPool(
    'USDC',
    'USDT',
    ChainIds.BOB_TESTNET,
    36000,
    '0x7803099d2d7774989dEe0862142d7226aD0D1bE0',
  ),
  new AmbientLiquidityPool(
    'DAI',
    'DLLR',
    ChainIds.BOB_TESTNET,
    36000,
    '0x3c4BD6408b1a5B30d477A21fa7D37C172E7AbF5D',
  ),
  new AmbientLiquidityPool(
    'USDT',
    'DLLR',
    ChainIds.BOB_TESTNET,
    36000,
    '0x76b43A1D4B31988F7Dd35E7AB11C844226B0B619',
  ),
  new AmbientLiquidityPool(
    'TBTC',
    'WBTC',
    ChainIds.BOB_TESTNET,
    36000,
    '0x39B408792C1D79963BA5Ad11F0EBbA78A89f9Bb3',
  ),
  new AmbientLiquidityPool(
    'RETH',
    'ETH',
    ChainIds.BOB_TESTNET,
    36000,
    '0x30EA200eAb8f81a64d6137c23Fd35e221461B79C',
  ),
  new AmbientLiquidityPool(
    'WSTETH',
    'ETH',
    ChainIds.BOB_TESTNET,
    36000,
    '0x1BAdd6f3E68a07876Ca87ac065bc0bD375794308',
  ),
  new AmbientLiquidityPool(
    'DLLR',
    'SOV',
    ChainIds.BOB_TESTNET,
    37000,
    '0xdf3E204f251fBA7d2830f7650e93E4D0Ff326c66',
  ),
  new AmbientLiquidityPool(
    'USDT',
    'SOV',
    ChainIds.BOB_TESTNET,
    37000,
    '0xdcd5E442720D8c997143a6406bC9FB42FF62eD92',
  ),
  new AmbientLiquidityPool(
    'USDC',
    'SOV',
    ChainIds.BOB_TESTNET,
    37000,
    '0xF6f49BAEd1cb08e9fC12a9052Da54435772cD01C',
  ),
  new AmbientLiquidityPool(
    'DAI',
    'SOV',
    ChainIds.BOB_TESTNET,
    37000,
    '0x83FB68d90fb2D9a04b34C2534A85ce587ffCfB0e',
  ),
  new AmbientLiquidityPool(
    'ETH',
    'SOV',
    ChainIds.BOB_TESTNET,
    37000,
    '0xdC1f62679a25bB9d568463ce007a3b91D01448FD',
  ),
  new AmbientLiquidityPool(
    'WSTETH',
    'SOV',
    ChainIds.BOB_TESTNET,
    37000,
    '0xC866AC350A893c8072618f63cfaF6d75796b4c9F',
  ),
  new AmbientLiquidityPool(
    'RETH',
    'SOV',
    ChainIds.BOB_TESTNET,
    37000,
    '0x4dDe2ea732609e886F578D0BD5B8b9A31FB10Ced',
  ),
  new AmbientLiquidityPool(
    'WBTC',
    'SOV',
    ChainIds.BOB_TESTNET,
    37000,
    '0xf59720432AA266D4B077efE659EEb36923f41Da2',
  ),
  new AmbientLiquidityPool(
    'TBTC',
    'SOV',
    ChainIds.BOB_TESTNET,
    37000,
    '0xf6ebf43f5a28CB9ecEea60234E60d87AF347CCF3',
  ),
  new AmbientLiquidityPool(
    'POWA',
    'SOV',
    ChainIds.BOB_TESTNET,
    38000,
    '0x165b73022AE5601494c3a200f92114736BD3Cfca',
  ),
];
