import { ChainIds } from '@sovryn/ethers-provider';

import { BOB_CHAIN_ID } from '../../../../../config/chains';

import { AmbientLiquidityPool } from './utils/AmbientLiquidityPool';

export const TESTNET_AMM = [
  // BOB
  new AmbientLiquidityPool(
    'WBTC',
    'SOV',
    BOB_CHAIN_ID,
    '36000',
    '0x8C3cD9182dbef229a36351633f470ea904e105Ac',
  ),
  new AmbientLiquidityPool(
    'tBTC',
    'SOV',
    BOB_CHAIN_ID,
    '36000',
    '0x68D00Ff88F3a5987584E313b42Cb11CfeeE4FB39',
  ),
  new AmbientLiquidityPool(
    'ETH',
    'SOV',
    BOB_CHAIN_ID,
    '36000',
    '0x869f0297749084e0256cC761867FE7cE456640FC',
  ),
  new AmbientLiquidityPool(
    'rETH',
    'SOV',
    BOB_CHAIN_ID,
    '36000',
    '0x4F39F44C022C7a79FA78E71f74F0eF2CFcEe10A4',
  ),
  new AmbientLiquidityPool(
    'wstETH',
    'SOV',
    BOB_CHAIN_ID,
    '36000',
    '0xaC716d3e8dd48DaEc9189943CAd08deFF60c59B0',
  ),
  new AmbientLiquidityPool(
    'USDT',
    'SOV',
    BOB_CHAIN_ID,
    '36000',
    '0x838c5172779357E60C28cc6315c8DCFa0F782786',
  ),
  new AmbientLiquidityPool(
    'USDC',
    'SOV',
    BOB_CHAIN_ID,
    '36000',
    '0xE1EA7bCD93232c66DE8D4D1a5e22da53803e7A69',
  ),
  new AmbientLiquidityPool(
    'DAI',
    'SOV',
    BOB_CHAIN_ID,
    '36000',
    '0xa87Bed23E26b2Bb7725173168D983eE4Ec0e2b64',
  ),
  new AmbientLiquidityPool(
    'DLLR',
    'SOV',
    BOB_CHAIN_ID,
    '36000',
    '0xe8523EBb8EC8Cf1b7f14D0623f7adB53b09f047C',
  ),
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
