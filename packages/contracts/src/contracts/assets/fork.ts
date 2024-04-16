import { constants } from 'ethers';

import { AssetDetails } from '../../types';

export const fork: Array<AssetDetails> = [
  {
    symbol: 'ETH',
    address: constants.AddressZero,
    name: 'Ether',
    isNative: true,
    decimals: 18,
    getIcon: async () => (await import('./icons/bob/eth')).default,
  },
  {
    symbol: 'SOV',
    address: '0x0D7423380F4b6f96D8188CCCfB086aBEC84A0934',
    name: 'SOV',
    decimals: 18,
    getIcon: async () => (await import('./icons/bob/sov')).default,
  },
  {
    symbol: 'USDT',
    address: '0xEc025c3651308Ff67835Cf0F147315466932E15c',
    name: 'USDT',
    decimals: 18,
    getIcon: async () => (await import('./icons/bob/usdt')).default,
  },
  {
    symbol: 'USDC',
    address: '0x378e86475772613daf249F4342f57617032acDBE',
    name: 'USDC',
    decimals: 18,
    getIcon: async () => (await import('./icons/bob/usdc')).default,
  },
  {
    symbol: 'DAI',
    address: '0x87d252A68a0AC2428C6e849f4Ec0b30DD3DCA62B',
    name: 'DAI',
    decimals: 18,
    getIcon: async () => (await import('./icons/bob/dai')).default,
  },
];
