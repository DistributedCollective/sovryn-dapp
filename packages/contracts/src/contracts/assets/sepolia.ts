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
    symbol: 'SOV',
    address: '0xebE5E8866db71286242af5fbF64e9464596a40F2',
    name: 'SOV',
    decimals: 18,
    getIcon: async () => (await import('./icons/rsk/sov')).default,
  },
  {
    symbol: 'USDT',
    address: '0x395131c2360101acB9Fa8a4d412b0bc43607DF22',
    name: 'USDT',
    decimals: 18,
    getIcon: async () => (await import('./icons/bob/usdt')).default,
  },
  {
    symbol: 'USDC',
    address: '0x0F004Fd9e9e1f884975908137F5494C3cA1D9914',
    name: 'USDC',
    decimals: 18,
    getIcon: async () => (await import('./icons/bob/usdc')).default,
  },
  {
    symbol: 'DAI',
    address: '0x39F696fC50a39E26c93c903eeF1fff1Df5c392C4',
    name: 'DAI',
    decimals: 18,
    getIcon: async () => (await import('./icons/bob/dai')).default,
  },
  {
    symbol: 'WETH',
    address: '0x9c4554B999Ee0F02B7a5c49bf5Af126844F87EE8',
    name: 'WETH',
    decimals: 18,
    getIcon: async () => (await import('./icons/bob/eth')).default,
  },
  {
    symbol: 'WBTC',
    address: '0x6404DD00Ff4d92B0bfD9A7EA032E592f47384F6D',
    name: 'WBTC',
    decimals: 18,
    getIcon: async () => (await import('./icons/bob/wbtc')).default,
  },
  {
    symbol: 'DLLR',
    address: '0x412342D0537B2d5F21E513Cf6C7bFb92D433a813',
    name: 'DLLR',
    decimals: 18,
    getIcon: async () => (await import('./icons/rsk/dllr')).default,
  },
  {
    symbol: 'RETH',
    address: '0x0215Ac7606a7408686C8B885b4A238b07EE28E7c',
    name: 'RETH',
    decimals: 18,
    getIcon: async () => (await import('./icons/bob/eth')).default,
  },
  {
    symbol: 'WSTETH',
    address: '0x9bF749d8555c73e55A227180fA5a77cD21251aaA',
    name: 'WSTETH',
    decimals: 18,
    getIcon: async () => (await import('./icons/bob/wsteth')).default,
  },
  {
    symbol: 'tBTC',
    address: '0xCfe5251BA648aFD41a079B7860803c52e09329e7',
    name: 'tBTC',
    decimals: 18,
    getIcon: async () => (await import('./icons/bob/wbtc')).default,
  },
];
