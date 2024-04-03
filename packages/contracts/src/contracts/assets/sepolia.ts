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
    symbol: 'USDC',
    address: '0x60bBA138A74C5e7326885De5090700626950d509',
    name: 'USDC',
    decimals: 6,
    getIcon: async () => (await import('./icons/unknown')).default,
  },
  {
    symbol: 'WBTC',
    address: '0xCA97CC9c1a1dfA54A252DaAFE9b5Cd1E16C81328',
    name: 'WBTC',
    decimals: 8,
    getIcon: async () => (await import('./icons/unknown')).default,
  },
];
