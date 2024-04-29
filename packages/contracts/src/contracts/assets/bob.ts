import { constants } from 'ethers';

import { AssetDetails } from '../../types';

export const bob: Array<AssetDetails> = [
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
    address: '0xF40A3C629661AF37010FAFbACA2eb4aA37d9abAa',
    name: 'WBTC (Mock)',
    decimals: 8,
    getIcon: async () => (await import('./icons/bob/wbtc')).default,
  },
  {
    symbol: 'TBTC',
    address: '0x42527B3ba7100ECA14c9405016752B6121328582',
    name: 'tBTC (Mock)',
    decimals: 18,
    getIcon: async () => (await import('./icons/bob/tbtc')).default,
  },
  {
    symbol: 'RETH',
    address: '0x0458b6a3b20a20D263df49D72dA928BfFe4473F3',
    name: 'rETH (Mock)',
    decimals: 18,
    getIcon: async () => (await import('./icons/bob/reth')).default,
  },
  {
    symbol: 'USDT',
    address: '0x26bF6A30286cE03176BF3B026Aa1f87b566ca891',
    name: 'USDT (Mock)',
    decimals: 6,
    getIcon: async () => (await import('./icons/bob/usdt')).default,
  },
  {
    symbol: 'DAI',
    address: '0x9FF262Fe3CB0c5AeDF081c580067BA846881Ed3C',
    name: 'DAI (Mock)',
    decimals: 18,
    getIcon: async () => (await import('./icons/bob/dai')).default,
  },
  {
    symbol: 'SOV',
    address: '0x93A37dDD1860a14C2d740f576C6BE5502A1ef06b',
    name: 'Sovryn (Mock)',
    decimals: 18,
    getIcon: async () => (await import('./icons/bob/sov')).default,
    description: 'Sovryn Token',
  },
  {
    symbol: 'USDC',
    address: '0xBd95925809F916eCFe140f6Ef70eA43185c0ECD9',
    name: 'USDC (Mock)',
    decimals: 6,
    getIcon: async () => (await import('./icons/bob/usdc')).default,
  },
  {
    symbol: 'ALEX',
    address: '0x41aBc192389aC3B63BBb5751984956eD8B2AB4A9',
    name: 'ALEX (Mock)',
    decimals: 18,
    getIcon: async () => (await import('./icons/unknown')).default,
  },
  {
    symbol: 'DLLR',
    address: '0xf545c0d1BaAAF7De1d2E0B2d2c1D59a0338ecCC2',
    name: 'DLLR (Mock)',
    decimals: 18,
    getIcon: async () => (await import('./icons/rsk/dllr')).default,
  },
  {
    symbol: 'POWA',
    address: '0x4Ad48819AB9f6601849dD4b73DF9b115C4AeFa3a',
    name: 'POWA (Mock)',
    decimals: 18,
    getIcon: async () => (await import('./icons/unknown')).default,
  },
  {
    symbol: 'WSTETH',
    address: '0x7fA3A90d5B19E6E4Bf4FD6F64904f2F953F30eaf',
    name: 'WSTETH (Mock)',
    decimals: 18,
    getIcon: async () => (await import('./icons/bob/eth')).default,
  },
];
