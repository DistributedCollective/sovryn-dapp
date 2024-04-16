import { Environments } from '../../types/global';

const TENDERLY_FORK_ID = '600da1f5-ca21-4d57-8192-233e092a5bf3';

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
