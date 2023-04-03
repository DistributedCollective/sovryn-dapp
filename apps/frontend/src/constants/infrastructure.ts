import { Environments, Services } from '../types/global';

export const SERVICES_CONFIG = {
  [Environments.Testnet]: {
    [Services.Maintenance]:
      'https://maintenance-mode.test.sovryn.app/maintenance',
    [Services.Notification]: 'https://notify.test.sovryn.app/',
  },
  [Environments.Mainnet]: {
    [Services.Maintenance]: 'https://maintenance-mode.sovryn.app/maintenance',
    [Services.Notification]: 'https://notify.sovryn.app/',
  },
};

export const RSK_RPC = {
  [Environments.Mainnet]: [
    'https://rsk-live.sovryn.app/rpc',
    'https://public-node.rsk.co',
  ],
  [Environments.Testnet]: [
    'https://testnet.sovryn.app/rpc',
    'https://public-node.testnet.rsk.co',
  ],
};

export const RSK_EXPLORER = {
  [Environments.Mainnet]: 'https://explorer.rsk.co',
  [Environments.Testnet]: 'https://explorer.testnet.rsk.co',
};

export const BTC_EXPLORER = {
  [Environments.Mainnet]: 'https://live.blockcypher.com/btc',
  [Environments.Testnet]: 'https://live.blockcypher.com/btc-testnet',
};
