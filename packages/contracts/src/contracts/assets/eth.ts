import { constants } from 'ethers';

import { AssetDetails } from '../../types';

export const eth: Array<AssetDetails> = [
  {
    symbol: 'ETH',
    address: constants.AddressZero,
    name: 'Ether',
    isNative: true,
    decimals: 18,
    getIcon: async () => (await import('./icons/rsk/eths')).default,
  },
  {
    symbol: 'ESOV',
    address: '0xbdab72602e9ad40fc6a6852caf43258113b8f7a5',
    name: 'Sovryn',
    decimals: 18,
    getIcon: async () => (await import('./icons/rsk/sov')).default,
    description: 'Sovryn Token bridged from Rootstock to Ethereum',
  },
  {
    symbol: 'DLLR',
    address: '0xbdbb63f938c8961af31ead3deba5c96e6a323dd1',
    name: 'DLLR',
    decimals: 18,
    getIcon: async () => (await import('./icons/rsk/dllr')).default,
  },
];
