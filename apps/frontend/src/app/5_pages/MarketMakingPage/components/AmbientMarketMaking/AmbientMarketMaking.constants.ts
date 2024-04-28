import { ChainIds } from '@sovryn/ethers-provider';

import { AmbientLiquidityPool } from './utils/AmbientLiquidityPool';

export const MAINNET_AMM = [
  // BOB mock pools
  new AmbientLiquidityPool(
    'USDC',
    'USDT',
    ChainIds.BOB_MAINNET,
    400,
    '0xe3De48e0Fcbd095BBF5C8C60E6af2f5Eb9c6c09a',
  ),
  new AmbientLiquidityPool(
    'DAI',
    'DLLR',
    ChainIds.BOB_MAINNET,
    400,
    '0x2ea24032A700881bA7E46106e45ecED16c5bC6fC',
  ),
  new AmbientLiquidityPool(
    'USDT',
    'DLLR',
    ChainIds.BOB_MAINNET,
    400,
    '0x2b29e30c4fb020c6fe45040eBd9Bf03e625a423E',
  ),
  new AmbientLiquidityPool(
    'TBTC',
    'WBTC',
    ChainIds.BOB_MAINNET,
    400,
    '0x2544C79c4719668Ee043B4f1CB5Be1714F5bd60A',
  ),
  new AmbientLiquidityPool(
    'RETH',
    'ETH',
    ChainIds.BOB_MAINNET,
    400,
    '0xb27cc36477bf608731d0198176AaBD448647da3a',
  ),
  new AmbientLiquidityPool(
    'WSTETH',
    'ETH',
    ChainIds.BOB_MAINNET,
    400,
    '0x9EE43a686B670d0b956eDCC7443abf167521B6e4',
  ),
  new AmbientLiquidityPool(
    'DLLR',
    'SOV',
    ChainIds.BOB_MAINNET,
    400,
    '0x125B225b5b38009CFC7a2bbBc7357a6B6C4531C1',
  ),
  new AmbientLiquidityPool(
    'WBTC',
    'SOV',
    ChainIds.BOB_MAINNET,
    400,
    '0xE2C2e34930112C1baDf7CA6023b9fd9A56bD3781',
  ),
  new AmbientLiquidityPool(
    'ETH',
    'SOV',
    ChainIds.BOB_MAINNET,
    400,
    '0x2a407b38d988298B7F7C3b90f1615E845dfFf163',
  ),
  new AmbientLiquidityPool(
    'POWA',
    'SOV',
    ChainIds.BOB_MAINNET,
    400,
    '0x587695479dC0bd18629cF3B93D5c5fF32951De71',
  ),
];

export const TESTNET_AMM = [
  // Sepolia
  new AmbientLiquidityPool('USDC', 'USDT', ChainIds.SEPOLIA, 36000),
  new AmbientLiquidityPool('DAI', 'DLLR', ChainIds.SEPOLIA, 36000),
  new AmbientLiquidityPool('USDT', 'DLLR', ChainIds.SEPOLIA, 36000),
  new AmbientLiquidityPool('TBTC', 'WBTC', ChainIds.SEPOLIA, 36000),
  new AmbientLiquidityPool('RETH', 'ETH', ChainIds.SEPOLIA, 36000),
  new AmbientLiquidityPool('WSTETH', 'ETH', ChainIds.SEPOLIA, 36000),
  new AmbientLiquidityPool(
    'DLLR',
    'SOV',
    ChainIds.SEPOLIA,
    36000,
    '0xD30d207dF3Fb1c58F6B72F63Bb90ce4Dc858a6bf',
  ),
  new AmbientLiquidityPool(
    'WBTC',
    'SOV',
    ChainIds.SEPOLIA,
    36000,
    '0xbE3eB83bDd84eccE667B1da12C06D0dC78b88132',
  ),
  new AmbientLiquidityPool(
    'ETH',
    'SOV',
    ChainIds.SEPOLIA,
    36000,
    '0x1139B088887237ed256687d9E1499275e37d9f2d',
  ),
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
  new AmbientLiquidityPool(
    'USDT',
    'ALEX',
    ChainIds.BOB_TESTNET,
    36000,
    '0xff9a5a59d60F74016726c4463E3c262C25520b81',
  ),
];
