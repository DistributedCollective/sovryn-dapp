import { Environments } from '../../types/global';

const rpc = {
  [Environments.Mainnet]: 'https://bsc.sovryn.app/mainnet',
  [Environments.Testnet]: 'https://bsc.sovryn.app/testnet',
};

export const BSC = {
  rpc,
  publicRpc: rpc,
  explorer: {
    [Environments.Mainnet]: 'https://bscscan.com',
    [Environments.Testnet]: 'https://testnet.bscscan.com',
  },
};
