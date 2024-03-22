import { Environments } from '../../types/global';

export const RSK = {
  rpc: {
    [Environments.Mainnet]: [
      'https://rsk-live.sovryn.app/rpc',
      'https://public-node.rsk.co',
    ],
    [Environments.Testnet]: [
      'https://testnet.sovryn.app/rpc',
      'https://public-node.testnet.rsk.co',
    ],
  },
  publicRpc: {
    [Environments.Mainnet]: 'https://mainnet.sovryn.app/rpc',
    [Environments.Testnet]: 'https://testnet.sovryn.app/rpc',
  },
  explorer: {
    [Environments.Mainnet]: 'https://explorer.rsk.co',
    [Environments.Testnet]: 'https://explorer.testnet.rsk.co',
  },
};
