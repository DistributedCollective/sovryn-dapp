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
    address: '0xb5E3dbAF69A46B71Fe9c055e6Fa36992ae6b2c1A',
    name: 'Wrapped Bitcoin',
    decimals: 8,
    getIcon: async () => (await import('./icons/bob/wbtc')).default,
  },
  {
    symbol: 'tBTC',
    address: '0x5fA95212825a474E2C75676e8D833330F261CaeD',
    name: 'tBTC',
    decimals: 18,
    getIcon: async () => (await import('./icons/bob/tbtc')).default,
  },
  {
    symbol: 'rETH',
    address: '0xA6b5f74DDCc75b4b561D84B19Ad7FD51f0405483',
    name: 'Rocket Pool ETH',
    decimals: 18,
    getIcon: async () => (await import('./icons/bob/reth')).default,
  },
  {
    symbol: 'USDT',
    address: '0x2267Ae86066097EF49884Aac96c63f70fE818eb3',
    name: 'Tether USD',
    decimals: 6,
    getIcon: async () => (await import('./icons/bob/usdt')).default,
  },
  {
    symbol: 'DAI',
    address: '0x3E610F32806e09C2Ba65b8c88A6E4f777c8Cb559',
    name: 'DAI Stablecoin',
    decimals: 18,
    getIcon: async () => (await import('./icons/bob/dai')).default,
  },
  {
    symbol: 'SOV',
    address: '0x67bF6DE7f8d4d13FBa410CBe05219cB26242A7C9',
    name: 'Sovryn Token',
    decimals: 18,
    getIcon: async () => (await import('./icons/bob/sov')).default,
  },
  {
    symbol: 'USDC',
    address: '0xfCDaC6196C22908ddA4CE84fb595B1C7986346bF',
    name: 'USD Coin',
    decimals: 6,
    getIcon: async () => (await import('./icons/bob/usdc')).default,
  },
  {
    symbol: 'DLLR',
    address: '0x87d252A68a0AC2428C6e849f4Ec0b30DD3DCA62B',
    name: 'Sovryn Dollar',
    decimals: 18,
    getIcon: async () => (await import('./icons/bob/dllr')).default,
  },
  {
    symbol: 'POWA',
    address: '0xFEbad8c0EA06e816FF21D1c772c46E02F10F2A23',
    name: 'POWA•RANGERS•GO',
    decimals: 18,
    getIcon: async () => (await import('./icons/bob/powa')).default,
  },
  {
    symbol: 'DOGGOTOTHEMOON',
    address: '', //TODO add testnet address for DOG•GO•TO•THE•MOON
    name: 'DOG•GO•TO•THE•MOON',
    decimals: 18,
    getIcon: async () => (await import('./icons/bob/dog')).default,
  },
  {
    symbol: 'WSTETH',
    address: '0xf83A152C0A526a45E93D91c95894a19A1258E30E',
    name: 'Wrapped Staked ETH',
    decimals: 18,
    getIcon: async () => (await import('./icons/bob/wsteth')).default,
  },
];
