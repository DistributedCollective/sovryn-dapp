import { ChainIds } from '@sovryn/ethers-provider';

import { AmbientLiquidityPool } from '../AmbientLiquidityPool';

export const mockBobMainnet: AmbientLiquidityPool[] = [
  // BOB mock pools
  new AmbientLiquidityPool(
    'mUSDC',
    'mUSDT',
    ChainIds.BOB_MAINNET,
    400,
    '0xD8E94463205A878C0C69f1bB583d3DA8e815c053',
  ),
  new AmbientLiquidityPool(
    'mDAI',
    'mDLLR',
    ChainIds.BOB_MAINNET,
    400,
    '0xbc7Cd41d3891751A73c6aC51F7141A6E5CF4f883',
  ),
  new AmbientLiquidityPool(
    'mUSDT',
    'mDLLR',
    ChainIds.BOB_MAINNET,
    400,
    '0x2EB0e807b400EF815132601739E32693fb290B49',
  ),
  new AmbientLiquidityPool(
    'mTBTC',
    'mWBTC',
    ChainIds.BOB_MAINNET,
    400,
    '0xE4Ddd39402b5e6fEa65094352920b6890826171A',
  ),
  new AmbientLiquidityPool(
    'mRETH',
    'ETH',
    ChainIds.BOB_MAINNET,
    400,
    '0xC96DF4eD0f3e90fD6d0D614fa638816B2a3d416b',
  ),
  new AmbientLiquidityPool(
    'mWSTETH',
    'ETH',
    ChainIds.BOB_MAINNET,
    400,
    '0x1AE9a7dCb38E4495D0DA9741457E1bF3b22700FA',
  ),
  new AmbientLiquidityPool(
    'mDLLR',
    'mSOV',
    ChainIds.BOB_MAINNET,
    410,
    '0x70B82f44dA2C1578624237469E0F9Fc05d568A9b',
  ),
  new AmbientLiquidityPool(
    'mUSDT',
    'mSOV',
    ChainIds.BOB_MAINNET,
    410,
    '0x1e894177d9f28CC3150ECB30E458bD9438D6C46e',
  ),
  new AmbientLiquidityPool(
    'mUSDC',
    'mSOV',
    ChainIds.BOB_MAINNET,
    410,
    '0x941fEF5263f46dc7c00CD122CcA2b8559CA8FB96',
  ),
  new AmbientLiquidityPool(
    'mDAI',
    'mSOV',
    ChainIds.BOB_MAINNET,
    410,
    '0x83c0E209589782DDe525Dfa20Ad19a502841eAA6',
  ),
  new AmbientLiquidityPool(
    'ETH',
    'mSOV',
    ChainIds.BOB_MAINNET,
    410,
    '0x0866A012aFB48e72E45ee12A4410aaa6CeD7E212',
  ),
  new AmbientLiquidityPool(
    'mWSTETH',
    'mSOV',
    ChainIds.BOB_MAINNET,
    410,
    '0x52bD02eCC0C198B5D6200f5E1eD58fefac643B88',
  ),
  new AmbientLiquidityPool(
    'mRETH',
    'mSOV',
    ChainIds.BOB_MAINNET,
    410,
    '0x6Cd59dF6D7dE6C12A76ded2141c71c08e4b70330',
  ),
  new AmbientLiquidityPool(
    'mWBTC',
    'mSOV',
    ChainIds.BOB_MAINNET,
    410,
    '0x5F17b43703713eE66bF33C940782dABEf77247a8',
  ),
  new AmbientLiquidityPool(
    'mTBTC',
    'mSOV',
    ChainIds.BOB_MAINNET,
    410,
    '0x9Fddb3a3D9a014A2A1F85DB3ebF6Ba5E26F4e5Ad',
  ),
  new AmbientLiquidityPool(
    'mPOWA',
    'mSOV',
    ChainIds.BOB_MAINNET,
    420,
    '0xb60DE4bCc958D79AbFAC1fcD8021075121A97111',
  ),
];
