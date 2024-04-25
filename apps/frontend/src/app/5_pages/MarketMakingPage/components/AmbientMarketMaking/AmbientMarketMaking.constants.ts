import { ChainIds } from '@sovryn/ethers-provider';

import { AmbientLiquidityPool } from './utils/AmbientLiquidityPool';

export const MAINNET_AMM = [
  // BOB mock pools
  // new AmbientLiquidityPool('ETH', 'mWSTETH', ChainIds.BOB_MAINNET, 400),
  // new AmbientLiquidityPool('mDLLR', 'mSOV', ChainIds.BOB_MAINNET, 400),
  // new AmbientLiquidityPool('ETH', 'mSOV', ChainIds.BOB_MAINNET, 400),
  // new AmbientLiquidityPool('mUSDC', 'mUSDT', ChainIds.BOB_MAINNET, 400),
  // new AmbientLiquidityPool('mDLLR', 'mDAI', ChainIds.BOB_MAINNET, 400),
  // new AmbientLiquidityPool('mWBTC', 'mTBTC', ChainIds.BOB_MAINNET, 400),
  // new AmbientLiquidityPool('mSOV', 'mPOWA', ChainIds.BOB_MAINNET, 400),
  // new AmbientLiquidityPool('mDLLR', 'mUSDT', ChainIds.BOB_MAINNET, 400),
  // new AmbientLiquidityPool('ETH', 'mRETH', ChainIds.BOB_MAINNET, 400),
  // new AmbientLiquidityPool('mWBTC', 'mSOV', ChainIds.BOB_MAINNET, 400),
];

export const TESTNET_AMM = [
  // BOB
  // new AmbientLiquidityPool('A18', 'B18', ChainIds.BOB_TESTNET, 36000),
  // new AmbientLiquidityPool('A18', 'C18', ChainIds.BOB_TESTNET, 36000),
  // Sepolia
  new AmbientLiquidityPool('A18', 'B18', ChainIds.SEPOLIA, 36000),
  new AmbientLiquidityPool('A18', 'C18', ChainIds.SEPOLIA, 36000),
  new AmbientLiquidityPool('C18', 'E6', ChainIds.SEPOLIA, 36000),
  // bob testnet
  new AmbientLiquidityPool('ETH', 'WSTETH', ChainIds.BOB_TESTNET, 36000),
  new AmbientLiquidityPool('DLLR', 'SOV', ChainIds.BOB_TESTNET, 36000),
  new AmbientLiquidityPool('ETH', 'SOV', ChainIds.BOB_TESTNET, 36000),
  new AmbientLiquidityPool('USDC', 'USDT', ChainIds.BOB_TESTNET, 36000),
  new AmbientLiquidityPool('DLLR', 'DAI', ChainIds.BOB_TESTNET, 36000),
  new AmbientLiquidityPool('WBTC', 'TBTC', ChainIds.BOB_TESTNET, 36000),
  new AmbientLiquidityPool('SOV', 'POWA', ChainIds.BOB_TESTNET, 36000),
  new AmbientLiquidityPool('DLLR', 'USDT', ChainIds.BOB_TESTNET, 36000),
  new AmbientLiquidityPool('ETH', 'RETH', ChainIds.BOB_TESTNET, 36000),
  new AmbientLiquidityPool('WBTC', 'SOV', ChainIds.BOB_TESTNET, 36000),
  // // BOB
  // new AmbientLiquidityPool(
  //   'WBTC',
  //   'SOV',
  //   ChainIds.BOB_TESTNET,
  //   36000,
  //   '0x8C3cD9182dbef229a36351633f470ea904e105Ac',
  // ),
  // new AmbientLiquidityPool(
  //   'tBTC',
  //   'SOV',
  //   ChainIds.BOB_TESTNET,
  //   36000,
  //   '0x68D00Ff88F3a5987584E313b42Cb11CfeeE4FB39',
  // ),
  // new AmbientLiquidityPool(
  //   'ETH',
  //   'SOV',
  //   ChainIds.BOB_TESTNET,
  //   36000,
  //   '0x869f0297749084e0256cC761867FE7cE456640FC',
  // ),
  // new AmbientLiquidityPool(
  //   'rETH',
  //   'SOV',
  //   ChainIds.BOB_TESTNET,
  //   36000,
  //   '0x4F39F44C022C7a79FA78E71f74F0eF2CFcEe10A4',
  // ),
  // new AmbientLiquidityPool(
  //   'wstETH',
  //   'SOV',
  //   ChainIds.BOB_TESTNET,
  //   36000,
  //   '0xaC716d3e8dd48DaEc9189943CAd08deFF60c59B0',
  // ),
  // new AmbientLiquidityPool(
  //   'USDT',
  //   'SOV',
  //   ChainIds.BOB_TESTNET,
  //   36000,
  //   '0x838c5172779357E60C28cc6315c8DCFa0F782786',
  // ),
  // new AmbientLiquidityPool(
  //   'USDC',
  //   'SOV',
  //   ChainIds.BOB_TESTNET,
  //   36000,
  //   '0xE1EA7bCD93232c66DE8D4D1a5e22da53803e7A69',
  // ),
  // new AmbientLiquidityPool(
  //   'DAI',
  //   'SOV',
  //   ChainIds.BOB_TESTNET,
  //   36000,
  //   '0xa87Bed23E26b2Bb7725173168D983eE4Ec0e2b64',
  // ),
  // new AmbientLiquidityPool(
  //   'DLLR',
  //   'SOV',
  //   ChainIds.BOB_TESTNET,
  //   36000,
  //   '0xe8523EBb8EC8Cf1b7f14D0623f7adB53b09f047C',
  // ),
  // new AmbientLiquidityPool('ETH', 'TIL', ChainIds.BOB_TESTNET, 36000),
  // new AmbientLiquidityPool('DAI', 'TIL', ChainIds.BOB_TESTNET, 36000),
  // new AmbientLiquidityPool('USDC', 'TIL', ChainIds.BOB_TESTNET, 36000),
  // // SEPOLIA
  // // BOB
  // new AmbientLiquidityPool(
  //   'WBTC',
  //   'SOV',
  //   ChainIds.SEPOLIA,
  //   36000,
  //   '0xbE3eB83bDd84eccE667B1da12C06D0dC78b88132',
  // ),
  // new AmbientLiquidityPool(
  //   'tBTC',
  //   'SOV',
  //   ChainIds.SEPOLIA,
  //   36000,
  //   '0x806A5b16dd906544B2CA9eD5dCDbDe9bdba25846',
  // ),
  // new AmbientLiquidityPool(
  //   'ETH',
  //   'SOV',
  //   ChainIds.SEPOLIA,
  //   36000,
  //   '0x1139B088887237ed256687d9E1499275e37d9f2d',
  // ),
  // new AmbientLiquidityPool(
  //   'rETH',
  //   'SOV',
  //   ChainIds.SEPOLIA,
  //   36000,
  //   '0xE015847C4919428b2878c983fe72e81f935344Bc',
  // ),
  // new AmbientLiquidityPool(
  //   'wstETH',
  //   'SOV',
  //   ChainIds.SEPOLIA,
  //   36000,
  //   '0x462636F7373Ce7DbD9bF58982755552eF62739Fc',
  // ),
  // new AmbientLiquidityPool(
  //   'USDT',
  //   'SOV',
  //   ChainIds.SEPOLIA,
  //   36000,
  //   '0x7D29c861792674f34eBd0940A773Ffb78E3058A1',
  // ),
  // new AmbientLiquidityPool(
  //   'USDC',
  //   'SOV',
  //   ChainIds.SEPOLIA,
  //   36000,
  //   '0x6DDEf9f66930e928733A17B93dc99fCF4Eee1E2B',
  // ),
  // new AmbientLiquidityPool(
  //   'DAI',
  //   'SOV',
  //   ChainIds.SEPOLIA,
  //   36000,
  //   '0xD308DD8D96De6BD4e03F35B192456F329394D373',
  // ),
  // new AmbientLiquidityPool(
  //   'DLLR',
  //   'SOV',
  //   ChainIds.SEPOLIA,
  //   36000,
  //   '0xD30d207dF3Fb1c58F6B72F63Bb90ce4Dc858a6bf',
  // ),
  // new AmbientLiquidityPool('ETH', 'VCT', ChainIds.SEPOLIA, 36000),
  // // Virtual
  // new AmbientLiquidityPool('ETH', 'SOV', ChainIds.FORK, 36000),
  // new AmbientLiquidityPool('ETH', 'USDT', ChainIds.FORK, 36000),
  // new AmbientLiquidityPool('ETH', 'USDC', ChainIds.FORK, 36000),
  // new AmbientLiquidityPool('ETH', 'DAI', ChainIds.FORK, 36000),
];
