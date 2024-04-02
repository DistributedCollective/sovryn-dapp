import { constants } from 'ethers';

import { AssetDetails } from '../../types';

export const bobTestnet: Array<AssetDetails> = [
  {
    symbol: 'ETH',
    address: constants.AddressZero,
    name: 'Ether',
    isNative: true,
    decimals: 18,
    getIcon: async () => (await import('./icons/unknown')).default,
    description: 'BOB Ether',
  },
  {
    symbol: 'SOV',
    address: '0x3E610F32806e09C2Ba65b8c88A6E4f777c8Cb559',
    name: 'Sovryn',
    decimals: 18,
    getIcon: async () => (await import('./icons/rsk/sov')).default,
    description: 'Sovryn Token',
  },
  {
    symbol: 'USDC',
    address: '0x0F004Fd9e9e1f884975908137F5494C3cA1D9914',
    name: 'USDC',
    decimals: 18,
    getIcon: async () => (await import('./icons/unknown')).default,
  },
  {
    symbol: 'USDT',
    address: '0x395131c2360101acB9Fa8a4d412b0bc43607DF22',
    name: 'USDT',
    decimals: 18,
    getIcon: async () => (await import('./icons/unknown')).default,
  },
  {
    symbol: 'DAI',
    address: '0x39F696fC50a39E26c93c903eeF1fff1Df5c392C4',
    name: 'DAI',
    decimals: 18,
    getIcon: async () => (await import('./icons/unknown')).default,
  },
  {
    symbol: 'WETH',
    address: '0x9c4554B999Ee0F02B7a5c49bf5Af126844F87EE8',
    name: 'WETH',
    decimals: 18,
    getIcon: async () => (await import('./icons/unknown')).default,
  },
  {
    symbol: 'WBTC',
    address: '0x6404DD00Ff4d92B0bfD9A7EA032E592f47384F6D',
    name: 'WBTC',
    decimals: 18,
    getIcon: async () => (await import('./icons/unknown')).default,
  },
];
