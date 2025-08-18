import { constants } from 'ethers';

import { AssetDetails } from '../../types';

export const bsc: Array<AssetDetails> = [
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
    address: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
    name: 'Binance USD',
    decimals: 18,
    getIcon: async () => (await import('./icons/bsc/busd')).default,
  },
  {
    symbol: 'USDT',
    address: '0x55d398326f99059ff775485246999027b3197955',
    name: 'Thether',
    decimals: 18,
    getIcon: async () => (await import('./icons/bsc/usdt')).default,
  },
  {
    symbol: 'USDC',
    address: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
    name: 'USDC',
    decimals: 18,
    getIcon: async () => (await import('./icons/bsc/usdc')).default,
  },
  {
    symbol: 'DAI',
    address: '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3',
    name: 'DAI',
    decimals: 18,
    getIcon: async () => (await import('./icons/bsc/dai')).default,
  },
  {
    symbol: 'ETH',
    address: '0x2170ed0880ac9a755fd29b2688956bd959f933f8',
    name: 'Etherium',
    decimals: 18,
    getIcon: async () => (await import('./icons/bsc/eth')).default,
  },
];
