import { Environments } from '../../types/global';

const rpc = {
  [Environments.Mainnet]: 'wss://bsc.sovryn.app/mainnet/websocket',
  [Environments.Testnet]: 'wss://bsc.sovryn.app/testnet/websocket',
};

export const BSC = {
  rpc,
  publicRpc: rpc,
  explorer: {
    [Environments.Mainnet]: 'https://bscscan.com',
    [Environments.Testnet]: 'https://testnet.bscscan.com',
  },
};
