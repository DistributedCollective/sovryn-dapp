import { Environments } from '../../types/global';

export const FORK = {
  rpc: {
    [Environments.Testnet]: [
      'https://virtual.mainnet.rpc.tenderly.co/85e84e6d-a6fe-4497-8cfc-e32db752ac01',
    ],
  },
  publicRpc: {
    [Environments.Testnet]:
      'https://virtual.mainnet.rpc.tenderly.co/85e84e6d-a6fe-4497-8cfc-e32db752ac01',
  },
  explorer: {
    [Environments.Testnet]:
      'https://dashboard.tenderly.co/explorer/vnet/85e84e6d-a6fe-4497-8cfc-e32db752ac01',
  },
};
