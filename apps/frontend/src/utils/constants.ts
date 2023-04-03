import { ChainIds } from '@sovryn/ethers-provider';

import { Environments, ReleaseFileContent, Services } from '../types/global';

export const requiredChain = ChainIds.RSK_TESTNET;

export const APPROVAL_FUNCTION = 'approve';

export const CR_THRESHOLDS = {
  start: 90,
  middleStart: 110,
  middleEnd: 150,
  end: 250,
};

export const graphRskUrl = process.env.REACT_APP_GRAPH_RSK;

export const graphZeroUrl = process.env.REACT_APP_GRAPH_ZERO;

export const graphMyntUrl = process.env.REACT_APP_GRAPH_MYNT;

export const servicesConfig = {
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

export const EXPORT_RECORD_LIMIT = 500;
export const DEFAULT_HISTORY_FRAME_PAGE_SIZE = 10;

export const DEFAULT_TIMEOUT_SECONDS = 5000;
export const LIQUIDATION_RESERVE_AMOUNT = 20;

// TODO: Refactor it into a similar config we have in dapp v1 (blockExplorers constant)
export const rskExplorer = {
  [Environments.Mainnet]: 'https://explorer.rsk.co',
  [Environments.Testnet]: 'https://explorer.testnet.rsk.co',
};

export const btcExplorer = {
  [Environments.Mainnet]: 'https://live.blockcypher.com/btc',
  [Environments.Testnet]: 'https://live.blockcypher.com/btc-testnet',
};

export const btcInSatoshis = 100000000;

export const rskFaucet = 'https://faucet.rsk.co';

export const currentRelease: ReleaseFileContent = JSON.parse(
  process.env.REACT_APP_RELEASE_DATA || '{}',
);
