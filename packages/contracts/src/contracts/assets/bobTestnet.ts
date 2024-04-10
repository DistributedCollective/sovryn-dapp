import { constants } from 'ethers';

import { AssetDetails } from '../../types';

export const bobTestnet: Array<AssetDetails> = [
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
    symbol: 'SOV',
    address: '0x3E610F32806e09C2Ba65b8c88A6E4f777c8Cb559',
    name: 'Sovryn',
    decimals: 18,
    getIcon: async () => (await import('./icons/bob/sov')).default,
    description: 'Sovryn Token',
  },
  {
    symbol: 'USDC',
    address: '0xEf6495e4D07Fa58e473C5CC3a2e3ebB8876CC798',
    name: 'USDC',
    decimals: 18,
    getIcon: async () => (await import('./icons/bob/usdc')).default,
  },
  {
    symbol: 'USDT',
    address: '0xfCDaC6196C22908ddA4CE84fb595B1C7986346bF',
    name: 'USDT',
    decimals: 18,
    getIcon: async () => (await import('./icons/bob/usdt')).default,
  },
  {
    symbol: 'DAI',
    address: '0x0D7423380F4b6f96D8188CCCfB086aBEC84A0934',
    name: 'DAI',
    decimals: 18,
    getIcon: async () => (await import('./icons/bob/dai')).default,
  },
];
