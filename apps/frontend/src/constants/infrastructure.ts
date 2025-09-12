import { INDEXER_URL, INDEXER_URL_TESTNET } from '@sovryn/sdk';

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

/** @deprecated */
export const INDEXER_SERVICE = {
  [Environments.Mainnet]: INDEXER_URL,
  [Environments.Testnet]: INDEXER_URL_TESTNET,
};

export const ESTIMATOR_URI = process.env.REACT_APP_ESTIMATOR_URI;

export const SOVRYN_INDEXER = {
  [Environments.Mainnet]: INDEXER_URL,
  [Environments.Testnet]: INDEXER_URL_TESTNET,
};

export const ORIGINS_URL = {
  [Environments.Mainnet]: 'https://origins.sovryn.app',
  [Environments.Testnet]: 'https://develop--crowdforge.netlify.app',
};
