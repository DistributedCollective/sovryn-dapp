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
    symbol: 'WBTC',
    address: '0x6DBed1fd7C490bb860D02F027C9257D9338Ed190',
    name: 'WBTC',
    decimals: 8,
    getIcon: async () => (await import('./icons/bob/wbtc')).default,
  },
  {
    symbol: 'tBTC',
    address: '0xD0c46F5103A098D59bb81B8b7863e369BAeD893C',
    name: 'tBTC',
    decimals: 18,
    getIcon: async () => (await import('./icons/bob/tbtc')).default,
  },
  {
    symbol: 'rETH',
    address: '0xFF1f68b0E903CC11d8F80714CA0A017E876E13a6',
    name: 'rETH',
    decimals: 18,
    getIcon: async () => (await import('./icons/bob/reth')).default,
  },
  {
    symbol: 'USDT',
    address: '0x9Fddb3a3D9a014A2A1F85DB3ebF6Ba5E26F4e5Ad',
    name: 'USDT',
    decimals: 6,
    getIcon: async () => (await import('./icons/bob/usdt')).default,
  },
  {
    symbol: 'DAI',
    address: '0x2528AC8426DdCbfd2E038D90532F52a9Ad5BD594',
    name: 'USDT',
    decimals: 18,
    getIcon: async () => (await import('./icons/bob/dai')).default,
  },
  {
    symbol: 'SOV',
    address: '0x05da4128d52750421D1bA07E932Cb68B28c69021',
    name: 'SOV (mock)',
    decimals: 18,
    getIcon: async () => (await import('./icons/bob/sov')).default,
  },
  {
    symbol: 'ALEX',
    address: '0xEe7E565fa3b9dc32b53c033c21943b0323BC3f96',
    name: 'ALEX',
    decimals: 18,
    getIcon: async () => (await import('./icons/unknown')).default,
  },
  {
    symbol: 'USDC',
    address: '0x143050408aCCb9A9a2f285e625537d48674f3e58',
    name: 'USDC',
    decimals: 6,
    getIcon: async () => (await import('./icons/bob/usdc')).default,
  },
  {
    symbol: 'DLLR',
    address: '0xDF53124d3ECa80bf11df9AA80E96F7B6d86aea55',
    name: 'DLLR',
    decimals: 18,
    getIcon: async () => (await import('./icons/bob/dllr')).default,
  },
  {
    symbol: 'POWA',
    address: '0x5785BDeF0F0C444eFE97194CA1Fe2B895D5893c0',
    name: 'POWA',
    decimals: 18,
    getIcon: async () => (await import('./icons/bob/powa')).default,
  },
  {
    symbol: 'WSTETH',
    address: '0xd5cF70706C54Ec4E8a999De340EC7C9C22fd999C',
    name: 'wsTETH',
    decimals: 18,
    getIcon: async () => (await import('./icons/bob/wsteth')).default,
  },
];
