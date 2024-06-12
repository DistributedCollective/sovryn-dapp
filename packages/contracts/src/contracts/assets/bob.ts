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
    address: '0x03C7054BCB39f7b2e5B2c7AcB37583e32D70Cfa3',
    name: 'Wrapped Bitcoin',
    decimals: 8,
    getIcon: async () => (await import('./icons/bob/wbtc')).default,
  },
  {
    symbol: 'tBTC',
    address: '0xBBa2eF945D523C4e2608C9E1214C2Cc64D4fc2e2',
    name: 'tBTC',
    decimals: 18,
    getIcon: async () => (await import('./icons/bob/tbtc')).default,
  },
  {
    symbol: 'rETH',
    address: '0xb5686c4f60904ec2bda6277d6fe1f7caa8d1b41a',
    name: 'Rocket Pool ETH',
    decimals: 18,
    getIcon: async () => (await import('./icons/bob/reth')).default,
  },
  {
    symbol: 'wstETH',
    address: '0x85008aE6198BC91aC0735CB5497CF125ddAAc528',
    name: 'Wrapped Staked ETH',
    decimals: 18,
    getIcon: async () => (await import('./icons/bob/wsteth')).default,
  },
  {
    symbol: 'USDT',
    address: '0x05d032ac25d322df992303dca074ee7392c117b9',
    name: 'Tether USD',
    decimals: 6,
    getIcon: async () => (await import('./icons/bob/usdt')).default,
  },
  {
    symbol: 'USDC',
    address: '0xe75D0fB2C24A55cA1e3F96781a2bCC7bdba058F0',
    name: 'USD Coin',
    decimals: 6,
    getIcon: async () => (await import('./icons/bob/usdc')).default,
  },
  {
    symbol: 'DAI',
    address: '0x6c851F501a3F24E29A8E39a29591cddf09369080',
    name: 'DAI Stablecoin',
    decimals: 18,
    getIcon: async () => (await import('./icons/bob/dai')).default,
  },
  {
    symbol: 'DLLR',
    address: '0xf3107eEC1e6F067552C035FD87199e1A5169CB20',
    name: 'Sovryn Dollar',
    decimals: 18,
    getIcon: async () => (await import('./icons/bob/dllr')).default,
  },
  {
    symbol: 'SOV',
    address: '0xba20a5e63eeEFfFA6fD365E7e540628F8fC61474',
    name: 'Sovryn Token',
    decimals: 18,
    getIcon: async () => (await import('./icons/bob/sov')).default,
  },
  {
    symbol: 'POWA',
    address: '0xd0C2f08a873186db5cFB7b767dB62BEF9e495BFF',
    name: 'POWA•RANGERS•GO',
    decimals: 18,
    getIcon: async () => (await import('./icons/bob/powa')).default,
  },
  // TODO: Only testing, delete later
  {
    symbol: 'MOCK2_WETH',
    address: '0x015FC1cd6f6159B8e2f93e4bA5495818d0f2ac8E',
    name: 'MOCK2_WETH',
    decimals: 18,
    getIcon: async () => (await import('./icons/bob/powa')).default,
  },
  {
    symbol: 'MOCK2_SOV',
    address: '0xDCD9F011cf1d5a7e33023fBE5d445Eb181F0b64E',
    name: 'MOCK2_SOV',
    decimals: 18,
    getIcon: async () => (await import('./icons/bob/sov')).default,
  },
  {
    symbol: 'MOCK_POWA',
    address: '0x4Ad48819AB9f6601849dD4b73DF9b115C4AeFa3a',
    name: 'MOCK_POWA',
    decimals: 18,
    getIcon: async () => (await import('./icons/bob/powa')).default,
  },
  {
    symbol: 'MOCK_GOB',
    address: '0x13411341d7c3140742B9aF45B8Db6d24f2428F3F',
    name: 'MOCK_GOV',
    decimals: 18,
    getIcon: async () => (await import('./icons/bob/sov')).default,
  },
];
