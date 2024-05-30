import { constants } from 'ethers';

import { AssetDetails } from '../../types';

export const rskTestnet: Array<AssetDetails> = [
  {
    symbol: 'BTC',
    address: constants.AddressZero,
    name: 'Bitcoin',
    isNative: true,
    decimals: 18,
    getIcon: async () => (await import('./icons/rsk/rbtc')).default,
    description: 'Rootstock Bitcoin',
  },
  {
    symbol: 'SOV',
    address: '0x6a9A07972D07e58F0daf5122d11E069288A375fb',
    name: 'Sovryn',
    decimals: 18,
    getIcon: async () => (await import('./icons/rsk/sov')).default,
    description: 'Sovryn Token',
  },
  {
    symbol: 'OSSOV',
    address: '0x687C75B68771E363F1675047F94c0a8a13493E67',
    name: 'Sovryn',
    decimals: 18,
    getIcon: async () => (await import('./icons/rsk/sov')).default,
    description: '',
  },
  {
    symbol: 'WBTC',
    address: '0x69FE5cEC81D5eF92600c1A0dB1F11986AB3758Ab',
    name: 'Wrapped Bitcoin',
    decimals: 18,
    getIcon: async () => (await import('./icons/rsk/rbtc')).default,
  },
  {
    symbol: 'XUSD',
    address: '0xa9262cc3fb54ea55b1b0af00efca9416b8d59570',
    decimals: 18,
    getIcon: async () => (await import('./icons/rsk/xusd')).default,
  },
  {
    symbol: 'DLLR',
    address: '0x007b3AA69A846cB1f76b60b3088230A52D2A83AC',
    decimals: 18,
    getIcon: async () => (await import('./icons/rsk/dllr')).default,
  },
  {
    symbol: 'DOC',
    address: '0xcb46c0ddc60d18efeb0e586c17af6ea36452dae0',
    decimals: 18,
    getIcon: async () => (await import('./icons/rsk/doc')).default,
  },
  {
    symbol: 'rDOC',
    address: '0xc3de9f38581f83e281f260d0ddbaac0e102ff9f8',
    decimals: 18,
    getIcon: async () => (await import('./icons/rsk/doc')).default,
  },
  {
    symbol: 'ZUSD',
    address: '0xe67cbA98C183A1693fC647d63AeeEC4053656dBB',
    decimals: 18,
    getIcon: async () => (await import('./icons/rsk/zusd')).default,
  },
  {
    symbol: 'BNB',
    address: '0x801F223Def9A4e3a543eAcCEFB79dCE981Fa2Fb5',
    name: 'Binance Coin (Bridged)',
    decimals: 18,
    getIcon: async () => (await import('./icons/rsk/bnbs')).default,
  },
  {
    symbol: 'ETH',
    address: '0x0Fd0d8D78Ce9299Ee0e5676a8d51F938C234162c',
    name: 'Ethereum (Bridged)',
    decimals: 18,
    getIcon: async () => (await import('./icons/rsk/eths')).default,
  },
  {
    symbol: 'FISH',
    address: '0xaa7038D80521351F243168FefE0352194e3f83C3',
    name: 'BabelFish',
    decimals: 18,
    getIcon: async () => (await import('./icons/rsk/fish')).default,
  },
  {
    symbol: 'MOC',
    address: '0x45a97b54021a3f99827641afe1bfae574431e6ab',
    name: 'Money On Chain',
    decimals: 18,
    getIcon: async () => (await import('./icons/rsk/moc')).default,
  },
  {
    symbol: 'RIF',
    address: '0x19f64674d8a5b4e652319f5e239efd3bc969a1fe',
    name: 'Rootstock Infrastructure Framework',
    decimals: 18,
    getIcon: async () => (await import('./icons/rsk/rif')).default,
  },
  {
    symbol: 'BPRO',
    address: '0x4dA7997A819bb46B6758b9102234c289Dd2ad3bf',
    decimals: 18,
    getIcon: async () => (await import('./icons/rsk/bpro')).default,
  },
  {
    symbol: 'RUSDT',
    address: '0x4a0741FA749eD6b1F810224D09f1f511952e67de',
    decimals: 18,
    getIcon: async () => (await import('./icons/rsk/rusdt')).default,
  },
  {
    symbol: 'MYNT',
    address: '0x139483e22575826183F5b56dd242f8f2C1AEf327',
    decimals: 18,
    getIcon: async () => (await import('./icons/rsk/mynt')).default,
  },
  {
    symbol: 'POWA',
    address: '0xfe8929d36ac789c562008abd59f5dd7e1eb1f5b6', // TODO: This is RSK Mainnet address, change it once we have it deployed on RSK Testnet
    name: 'POWA•RANGERS•GO',
    decimals: 18,
    getIcon: async () => (await import('./icons/rsk/powa')).default,
  },
];
