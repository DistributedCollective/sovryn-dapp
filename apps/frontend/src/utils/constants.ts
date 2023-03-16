import { ChainIds } from '@sovryn/ethers-provider';

import { Environments, ReleaseFileContent, Services } from '../types/global';

export const sovrynLinks = {
  discord: 'https://discord.gg/kBTNx4zjRf',
  telegram: 'https://t.me/SovrynBitcoin',
  twitter: ' https://twitter.com/SovrynBTC',
  github: 'https://github.com/DistributedCollective',
  github_dapp: 'https://github.com/DistributedCollective/sovryn-dapp',
  website: 'https://sovryn.com',
  blog: 'https://sovryn.com/all-things-sovryn',
  security: 'https://wiki.sovryn.com/technical-documents#security',
  fees: 'https://wiki.sovryn.com/sovryn-dapp/fees#zero-borrowing',
};

export const sovrynAlphaLinks = {
  [Environments.Mainnet]: 'https://alpha.sovryn.app/',
  [Environments.Testnet]: 'https://alpha-test.sovryn.app',
};
export const sovrynAlphaStagingLink = 'https://alpha-staging.sovryn.app';

export const sovrynStagingLink = 'https://staging.sovryn.com';

export const sovrynWikiLinks = {
  root: 'https://wiki.sovryn.com',
  stabilityPool:
    'https://wiki.sovryn.com/sovryn-dapp/using-zero#earn-in-the-stability-pool',
  ammPool: 'https://wiki.sovryn.com/sovryn-dapp/market-making',
  lend: 'https://wiki.sovryn.com/sovryn-dapp/lending',
  trade: 'https://wiki.sovryn.com/sovryn-dapp/trading',
  bridge:
    'https://babelfish.gitbook.io/the-babelfish-gitbook/tutorials-and-guides/bridges',
  notification:
    'https://wiki.sovryn.com/sovryn-dapp/using-zero#set-notifications',
};

export const helpdeskLink = 'https://help.sovryn.app/';

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

export const MAX_GAS_LIMIT = 6_800_000;
export const GAS_LIMIT_OPEN_TROVE = 1_100_000;
export const GAS_LIMIT_ADJUST_TROVE = 800_000;
export const GAS_LIMIT_CLOSE_TROVE = 350_000;
export const GAS_LIMIT_CLOSE_DLLR_TROVE = 500_000;
export const GAS_LIMIT_CONVERT = 150_000;
export const GAS_LIMIT_STABILITY_POOL = 250_000;
export const GAS_LIMIT_STABILITY_POOL_INC_WITHDRAW = 490_000;
export const GAS_LIMIT_STABILITY_POOL_DLLR = 500_000;
export const GAS_LIMIT_STABILITY_POOL_DLLR_INC_WITHDRAW = 690_000;
export const GAS_LIMIT_REWARDS = 240_000;
export const GAS_LIMIT_TRANSFER_LOC = 900_000;

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

//TODO: refactor into Bitcoin asset definition later
export const Bitcoin = 'BTC';
export const USD = 'USD';

export const rskFaucet = 'https://faucet.rsk.co';

export const currentRelease: ReleaseFileContent = JSON.parse(
  process.env.REACT_APP_RELEASE_DATA || '{}',
);
