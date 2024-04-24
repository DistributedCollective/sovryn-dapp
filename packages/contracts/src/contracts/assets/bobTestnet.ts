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
    address: '0xe5a2C0c6037c5B0008B7800bE22C94Bd899F1a59',
    name: 'Sovryn',
    decimals: 18,
    getIcon: async () => (await import('./icons/bob/sov')).default,
    description: 'Sovryn Token',
  },
  {
    symbol: 'USDC',
    address: '0x304E007A6e093dE6e047563a1Ebb82e11BDceaf5',
    name: 'USDC',
    decimals: 18,
    getIcon: async () => (await import('./icons/bob/usdc')).default,
  },
  {
    symbol: 'USDT',
    address: '0x16ca12702BF1cf671548c904ace633aF3cCa33dd',
    name: 'USDT',
    decimals: 18,
    getIcon: async () => (await import('./icons/bob/usdt')).default,
  },
  {
    symbol: 'DAI',
    address: '0x78555bd817BE80cACFEd6DB3eC9B262c29937278',
    name: 'DAI',
    decimals: 18,
    getIcon: async () => (await import('./icons/bob/dai')).default,
  },
  {
    symbol: 'WETH',
    address: '0x4d9dB3FA7007e59Ac93e5FCc1bE872182d2EE07c',
    name: 'WETH',
    decimals: 18,
    getIcon: async () => (await import('./icons/bob/eth')).default,
  },
  {
    symbol: 'WBTC',
    address: '0x67519D48d57C94714b76d678B0998a525C1A362F',
    name: 'WBTC',
    decimals: 18,
    getIcon: async () => (await import('./icons/bob/wbtc')).default,
  },
  {
    symbol: 'DLLR',
    address: '0x28A6328B0e167035F33a4C58374F2524Ae9c8dC1',
    name: 'DLLR',
    decimals: 18,
    getIcon: async () => (await import('./icons/rsk/dllr')).default,
  },
  {
    symbol: 'rETH',
    address: '0x820baF06b193143718308B8ef3b19C1490202cFf',
    name: 'rETH',
    decimals: 18,
    getIcon: async () => (await import('./icons/bob/reth')).default,
  },
  {
    symbol: 'wstETH',
    address: '0x41b5f6584b22ac5b118e013eA3289b85C8E25D89',
    name: 'wstETH',
    decimals: 18,
    getIcon: async () => (await import('./icons/bob/wsteth')).default,
  },
  {
    symbol: 'tBTC',
    address: '0xEdEF1E6d570317a7Cb65EA1eDBb18C0184BD4C70',
    name: 'tBTC',
    decimals: 18,
    getIcon: async () => (await import('./icons/bob/tbtc')).default,
  },
  {
    symbol: 'TIL',
    address: '0xd0FE317B5D6caa7299E3cC094EACc96c0B116184',
    name: 'Tiltom Token',
    decimals: 6,
    getIcon: async () => (await import('./icons/unknown')).default,
  },
];
