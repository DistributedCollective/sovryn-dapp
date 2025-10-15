import { constants } from 'ethers';

import { AssetDetails } from '../../types';

export const bscTestnet: Array<AssetDetails> = [
  {
    symbol: 'BNB',
    address: constants.AddressZero,
    name: 'Binance Coin',
    decimals: 18,
    isNative: true,
    getIcon: async () => (await import('./icons/bsc/bnb')).default,
  },
  {
    symbol: 'BUSD',
    address: '0x137BEc8c83740920ebc4f29f51C7B65b75Beec83',
    name: 'Binance USD',
    decimals: 18,
    getIcon: async () => (await import('./icons/bsc/busd')).default,
  },
  {
    symbol: 'USDT',
    address: '0x268e3bf855cbcdf8fe31ba3557a554ab2283351f',
    name: 'Thether',
    decimals: 18,
    getIcon: async () => (await import('./icons/bsc/usdt')).default,
  },
  {
    symbol: 'USDC',
    address: '0x0b654c687dc8b828139406c070e0a34486e5072b',
    name: 'USDC',
    decimals: 18,
    getIcon: async () => (await import('./icons/bsc/usdc')).default,
  },
  {
    symbol: 'DAI',
    address: '0x83241490517384cb28382bdd4d1534ee54d9350f',
    name: 'DAI',
    decimals: 18,
    getIcon: async () => (await import('./icons/bsc/dai')).default,
  },
  {
    symbol: 'ETH',
    address: '0x7d1FE4FdB0Afaf26ada5083A688139EbA10d3e1B',
    name: 'Etherium',
    decimals: 18,
    getIcon: async () => (await import('./icons/bsc/eth')).default,
  },
];
