import { Environments } from '../../types/global';

const rpc = {
  [Environments.Mainnet]: 'https://rpc.bitlayer.org',
  [Environments.Testnet]: 'https://testnet-rpc.bitlayer.org',
};

export const BITLAYER = {
  rpc,
  publicRpc: rpc,
  explorer: {
    [Environments.Mainnet]: 'https://www.btrscan.com',
    [Environments.Testnet]: 'https://testnet-scan.bitlayer.org',
  },
};
