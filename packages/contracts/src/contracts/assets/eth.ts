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
    address: '0x1f4a4737ECcB77B4b63B34edFb32515940d69A34',
    name: 'Sovryn',
    decimals: 18,
    getIcon: async () => (await import('./icons/rsk/sov')).default,
    description: 'Sovryn Token bridged from Rootstock to Ethereum',
  },
  {
    symbol: 'DLLR',
    address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    name: 'DLLR',
    decimals: 18,
    getIcon: async () => (await import('./icons/rsk/dllr')).default,
  },
];
