import { constants } from 'ethers';

import { AssetDetails } from '../../types';

export const sepolia: Array<AssetDetails> = [
  {
    symbol: 'ETH',
    address: constants.AddressZero,
    name: 'Ether',
    isNative: true,
    decimals: 18,
    getIcon: async () => (await import('./icons/rsk/eths')).default,
  },
  {
    symbol: 'VCT',
    address: '0xf05DAE5c43048d3e579e710683CAD73Fa3756b04',
    name: 'Victor',
    decimals: 18,
    getIcon: async () => (await import('./icons/unknown')).default,
  },
  {
    symbol: 'SOV',
    address: '0xebE5E8866db71286242af5fbF64e9464596a40F2',
    name: 'SOV',
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
    symbol: 'USDC',
    address: '0x0F004Fd9e9e1f884975908137F5494C3cA1D9914',
    name: 'USDC',
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
];
