import { Environments } from '../../types/global';

const TENDERLY_FORK_ID = '612b39ab-7310-4e58-a69e-6b98b0962b7d';

export const FORK = {
  rpc: {
    [Environments.Testnet]: [
      'https://rpc.tenderly.co/fork/' + TENDERLY_FORK_ID,
      // 'https://rpc.vnet.tenderly.co/devnet/my-first-devnet/d2a17dcf-81a0-4c53-b773-798db4521cd9',
    ],
  },
  publicRpc: {
    [Environments.Testnet]: 'https://rpc.tenderly.co/fork/' + TENDERLY_FORK_ID,
  },
  explorer: {
    [Environments.Testnet]:
      'https://dashboard.tenderly.co/explorer/fork/' +
      TENDERLY_FORK_ID +
      '/transactions',
  },
};
