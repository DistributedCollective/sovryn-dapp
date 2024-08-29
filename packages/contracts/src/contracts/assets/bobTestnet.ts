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
    name: 'Wrapped Bitcoin',
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
    name: 'Rocket Pool ETH',
    decimals: 18,
    getIcon: async () => (await import('./icons/bob/reth')).default,
  },
  {
    symbol: 'USDT',
    address: '0x9Fddb3a3D9a014A2A1F85DB3ebF6Ba5E26F4e5Ad',
    name: 'Tether USD',
    decimals: 6,
    getIcon: async () => (await import('./icons/bob/usdt')).default,
  },
  {
    symbol: 'DAI',
    address: '0x4e4e256D3a9789329AB540a7a3b2cd0c03C40431',
    name: 'DAI Stablecoin',
    decimals: 18,
    getIcon: async () => (await import('./icons/bob/dai')).default,
  },
  {
    symbol: 'SOV',
    address: '0x05da4128d52750421D1bA07E932Cb68B28c69021',
    name: 'Sovryn Token',
    decimals: 18,
    getIcon: async () => (await import('./icons/bob/sov')).default,
  },
  {
    symbol: 'USDC',
    address: '0x509AeFe02953BC2fB8abCa53Fd83C94D86c05922',
    name: 'USD Coin',
    decimals: 18,
    getIcon: async () => (await import('./icons/bob/usdc')).default,
  },
  {
    symbol: 'DLLR',
    address: '0xDF53124d3ECa80bf11df9AA80E96F7B6d86aea55',
    name: 'Sovryn Dollar',
    decimals: 18,
    getIcon: async () => (await import('./icons/bob/dllr')).default,
  },
  {
    symbol: 'POWA',
    address: '0x5785BDeF0F0C444eFE97194CA1Fe2B895D5893c0',
    name: 'POWA•RANGERS•GO',
    decimals: 18,
    getIcon: async () => (await import('./icons/bob/powa')).default,
  },
  {
    symbol: 'WSTETH',
    address: '0xd5cF70706C54Ec4E8a999De340EC7C9C22fd999C',
    name: 'Wrapped Staked ETH',
    decimals: 18,
    getIcon: async () => (await import('./icons/bob/wsteth')).default,
  },
  {
    symbol: 'aWETH',
    // TODO: properly adjust this variable
    address: '0x1b57354f10EFc441803639F74E9624CcA6Ab7abA',
    name: 'Aave Wrapped ETH',
    decimals: 18,
    getIcon: async () => (await import('./icons/bob/eth')).default,
  },
  {
    symbol: 'WETH',
    // TODO: properly adjust this variable
    address: '0x936EA1bCF82Fbc1Dbe24c6AA140f136A7De15C2E',
    name: 'Wrapped ETH',
    decimals: 18,
    getIcon: async () => (await import('./icons/bob/eth')).default,
  },
];
