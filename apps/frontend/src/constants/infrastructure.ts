import { Environments, Services } from '../types/global';

export const SERVICES_CONFIG = {
  [Environments.Testnet]: {
    [Services.Maintenance]:
      'https://maintenance-mode.test.sovryn.app/maintenance',
    [Services.Notification]: 'https://notify.test.sovryn.app/',
    [Services.Amm]: 'https://amm-apy.test.sovryn.app/',
  },
  [Environments.Mainnet]: {
    [Services.Maintenance]: 'https://maintenance-mode.sovryn.app/maintenance',
    [Services.Notification]: 'https://notify.sovryn.app/',
    [Services.Amm]: 'https://amm-apy.sovryn.app/',
  },
};

// Used for adding a new chain to a wallet
export const PUBLIC_RSK_RPC = {
  [Environments.Mainnet]: 'https://mainnet.sovryn.app/rpc',
  [Environments.Testnet]: 'https://testnet.sovryn.app/rpc',
};

export const PUBLIC_BOB_RPC = {
  [Environments.Mainnet]: 'https://rpc.gobob.xyz',
  [Environments.Testnet]: 'https://testnet.rpc.gobob.xyz',
};

// Used for contract calls
export const RSK_RPC = {
  [Environments.Mainnet]: [
    'https://rsk-live.sovryn.app/rpc',
    'https://public-node.rsk.co',
  ],
  [Environments.Testnet]: [
    PUBLIC_RSK_RPC[Environments.Testnet],
    'https://public-node.testnet.rsk.co',
  ],
};

export const BOB_RPC = {
  [Environments.Mainnet]: [PUBLIC_BOB_RPC[Environments.Mainnet]],
  [Environments.Testnet]: [PUBLIC_BOB_RPC[Environments.Testnet]],
};

export const BOB_RELAYER = {
  [Environments.Mainnet]: 'https://gsn-relay.gobob.xyz',
  [Environments.Testnet]: 'https://gsn-relay-sepolia.gobob.xyz',
};

export const BOB_BUNDLER = {
  [Environments.Mainnet]: 'https://bundler.gobob.xyz',
  [Environments.Testnet]: 'https://bundler-sepolia.gobob.xyz',
};

//TODO: refactor this into separate dictionary file once we add more chains
export const RSK_EXPLORER = {
  [Environments.Mainnet]: 'https://explorer.rsk.co',
  [Environments.Testnet]: 'https://explorer.testnet.rsk.co',
};

export const BOB_EXPLORER = {
  [Environments.Mainnet]: 'https://explorer.gobob.xyz',
  [Environments.Testnet]: 'https://testnet-explorer.gobob.xyz',
};

export const BTC_EXPLORER = {
  [Environments.Mainnet]: 'https://mempool.space',
  [Environments.Testnet]: 'https://mempool.space/testnet',
};

export const GRAPH_WRAPPER = {
  [Environments.Mainnet]: 'https://graph-wrapper.sovryn.app',
  [Environments.Testnet]: 'https://graph-wrapper.test.sovryn.app',
};

export const AMM_SERVICE = {
  [Environments.Mainnet]: 'https://amm-apy.sovryn.app/',
  [Environments.Testnet]: 'https://amm-apy.test.sovryn.app/',
};

export const ESTIMATOR_URI = process.env.REACT_APP_ESTIMATOR_URI;
