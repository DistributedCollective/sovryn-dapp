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

export const ETH_RPC = {
  [Environments.Mainnet]: [
    'https://eth.llamarpc.com',
    'https://ethereum.publicnode.com',
  ],
  [Environments.Testnet]: ['https://rpc2.sepolia.org'],
};

//TODO: refactor this into separate dictionary file once we add more chains
export const RSK_EXPLORER = {
  [Environments.Mainnet]: 'https://explorer.rsk.co',
  [Environments.Testnet]: 'https://explorer.testnet.rsk.co',
};

export const ETH_EXPLORER = {
  [Environments.Mainnet]: 'https://etherscan.io',
  [Environments.Testnet]: 'https://sepolia.etherscan.io',
};

export const BTC_EXPLORER = {
  [Environments.Mainnet]: 'https://live.blockcypher.com/btc',
  [Environments.Testnet]: 'https://live.blockcypher.com/btc-testnet',
};

export const ESTIMATOR_URI = process.env.REACT_APP_ESTIMATOR_URI;
