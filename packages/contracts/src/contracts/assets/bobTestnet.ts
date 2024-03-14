import { constants } from 'ethers';

import { AssetDetails } from '../../types';

export const bobTestnet: Array<AssetDetails> = [
  {
    symbol: 'BTC',
    address: constants.AddressZero,
    name: 'Bitcoin',
    isNative: true,
    decimals: 18,
    getIcon: async () => (await import('./icons/unknown')).default,
    description: 'BOB Bitcoin',
  },
  {
    symbol: 'SOV',
    address: '0x1f4a4737ECcB77B4b63B34edFb32515940d69A34',
    name: 'Sovryn',
    decimals: 18,
    getIcon: async () => (await import('./icons/rsk/sov')).default,
    description: 'Sovryn Token',
  },
  {
    symbol: 'USDC',
    address: '0x27c3321E40f039d10D5FF831F528C9CEAE601B1d',
    name: 'USDC',
    decimals: 18,
    getIcon: async () => (await import('./icons/unknown')).default,
  },
  {
    symbol: 'WBTC',
    address: '0x2868d708e442A6a940670d26100036d426F1e16b',
    name: 'Wrapped Bitcoin',
    decimals: 18,
    getIcon: async () => (await import('./icons/unknown')).default,
  },
];
