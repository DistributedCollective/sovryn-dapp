import { constants } from 'ethers';

import { AssetDetails } from '../../types';

export const bob: Array<AssetDetails> = [
  {
    symbol: 'ETH',
    address: constants.AddressZero,
    name: 'Ether',
    isNative: true,
    decimals: 18,
    getIcon: async () => (await import('./icons/bob/eth')).default,
    description: 'BOB Ether',
  },
  {
    symbol: 'WBTC',
    address: '0x03c7054bcb39f7b2e5b2c7acb37583e32d70cfa3',
    name: 'WBTC',
    decimals: 8,
    getIcon: async () => (await import('./icons/bob/wbtc')).default,
  },
  {
    symbol: 'tBTC',
    address: '0xBBa2eF945D523C4e2608C9E1214C2Cc64D4fc2e2',
    name: 'tBTC',
    decimals: 18,
    getIcon: async () => (await import('./icons/bob/tbtc')).default,
  },
  {
    symbol: 'rETH',
    address: '0xb5686c4f60904ec2bda6277d6fe1f7caa8d1b41a',
    name: 'rETH',
    decimals: 18,
    getIcon: async () => (await import('./icons/bob/reth')).default,
  },
  {
    symbol: 'USDT',
    address: '0x05d032ac25d322df992303dca074ee7392c117b9',
    name: 'USDT',
    decimals: 6,
    getIcon: async () => (await import('./icons/bob/usdt')).default,
  },
  {
    symbol: 'DAI',
    address: '0x6c851f501a3f24e29a8e39a29591cddf09369080',
    name: 'DAI',
    decimals: 18,
    getIcon: async () => (await import('./icons/bob/dai')).default,
  },
  {
    symbol: 'SOV',
    address: '0xba20a5e63eeEFfFA6fD365E7e540628F8fC61474',
    name: 'Sovryn',
    decimals: 18,
    getIcon: async () => (await import('./icons/bob/sov')).default,
    description: 'Sovryn Token',
  },
  {
    symbol: 'ALEX',
    address: '0xa669e059fdcbdfc532a2edd658eb2922799eedb8',
    name: 'ALEX',
    decimals: 18,
    getIcon: async () => (await import('./icons/unknown')).default,
  },
  {
    symbol: 'DLLR',
    address: '0xf3107eEC1e6F067552C035FD87199e1A5169CB20',
    name: 'DLLR',
    decimals: 18,
    getIcon: async () => (await import('./icons/rsk/dllr')).default,
  },
  // {
  //   symbol: 'USDC',
  //   address: '',
  //   name: 'USDC',
  //   decimals: 18,
  //   getIcon: async () => (await import('./icons/bob/usdc')).default,
  // },
  // {
  //   symbol: 'WETH',
  //   address: '',
  //   name: 'WETH',
  //   decimals: 18,
  //   getIcon: async () => (await import('./icons/bob/eth')).default,
  // },
  // {
  //   symbol: 'wstETH',
  //   address: '',
  //   name: 'wstETH',
  //   decimals: 18,
  //   getIcon: async () => (await import('./icons/bob/wsteth')).default,
  // },
];
