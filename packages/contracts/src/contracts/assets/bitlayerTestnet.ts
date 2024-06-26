import { constants } from 'ethers';

import { AssetDetails } from '../../types';

export const bitlayerTestnet: Array<AssetDetails> = [
  {
    symbol: 'BTC',
    address: constants.AddressZero,
    name: 'Bitcoin',
    isNative: true,
    decimals: 18,
    getIcon: async () => (await import('./icons/unknown')).default,
    description: 'Bitcoin',
  },
  {
    symbol: 'WBTC',
    address: '0xc442ce6a859d3155B4c1347dD424ad11a936f560',
    name: 'Wrapped Bitcoin',
    decimals: 18,
    getIcon: async () => (await import('./icons/unknown')).default,
  },
  {
    symbol: 'tBTC',
    address: '0x6645096dEC23E5168C352BA0cB0E6D4970040dde',
    decimals: 18,
    getIcon: async () => (await import('./icons/unknown')).default,
  },
  {
    symbol: 'rETH',
    address: '0xEc025c3651308Ff67835Cf0F147315466932E15c',
    decimals: 18,
    getIcon: async () => (await import('./icons/unknown')).default,
  },
  {
    symbol: 'USDT',
    address: '0x6d21769F31E06c4A2e123Cd1B40d840150A67Fb6',
    decimals: 18,
    getIcon: async () => (await import('./icons/unknown')).default,
  },
  {
    symbol: 'DAI',
    address: '0xA328Ab97Be109Ce0b4dFd70DaD773105FB2d81a7',
    decimals: 18,
    getIcon: async () => (await import('./icons/unknown')).default,
  },
  {
    symbol: 'eSOV',
    address: '0x5A31feEb51B9Fc3075FEBdE967c85da5210eff4b',
    decimals: 18,
    getIcon: async () => (await import('./icons/unknown')).default,
  },
  {
    symbol: 'ALEX',
    address: '0x1CAd822537903dC5d316e66b61C71fF54184b455',
    decimals: 18,
    getIcon: async () => (await import('./icons/unknown')).default,
  },
  {
    symbol: 'USDC',
    address: '0xE34A89C9943A79eE895a1163A57422F3Bca6E931',
    decimals: 18,
    getIcon: async () => (await import('./icons/unknown')).default,
  },
  {
    symbol: 'DLLR',
    address: '0x25dA1d18C29479427F9aEE57b3F2Fe7148EcA67B',
    decimals: 18,
    getIcon: async () => (await import('./icons/unknown')).default,
  },
  {
    symbol: 'POWA',
    address: '0x1C152B98A5eAeA683333177E21D3610bD6B3c8bf',
    decimals: 18,
    getIcon: async () => (await import('./icons/unknown')).default,
  },
  {
    symbol: 'wstETH',
    address: '0x2756b9d84Ec55d2987eE28d269d48780f05Fdcb7',
    decimals: 18,
    getIcon: async () => (await import('./icons/unknown')).default,
  },
];
