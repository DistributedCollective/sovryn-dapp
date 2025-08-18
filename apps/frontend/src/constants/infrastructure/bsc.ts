import { Environments } from '../../types/global';

export const BSC = {
  rpc: {
    [Environments.Testnet]: ['https://bsc-testnet-rpc.publicnode.com'],
  },
  publicRpc: {
    [Environments.Testnet]: 'https://bsc-testnet-rpc.publicnode.com',
  },
  explorer: {
    [Environments.Testnet]: 'https://testnet.bscscan.com/',
  },
};
