import { constants } from 'ethers';

import { AssetDetails } from '../../types';

export const fork: Array<AssetDetails> = [
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
    name: 'VCT',
    decimals: 18,
    getIcon: async () => (await import('./icons/unknown')).default,
  },
  {
    symbol: 'SBL',
    address: '0x2587c8a3f6969239d66BAc41fc1085Ab32a9331D',
    name: 'SBL',
    decimals: 18,
    getIcon: async () => (await import('./icons/unknown')).default,
  },
  {
    symbol: 'CPL',
    address: '0x230Eb714A710DeF5cbc09DF27a7a360F947e015F',
    name: 'CPL',
    decimals: 18,
    getIcon: async () => (await import('./icons/unknown')).default,
  },
];
