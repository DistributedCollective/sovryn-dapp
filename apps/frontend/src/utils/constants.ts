import { ChainIds } from '@sovryn/ethers-provider';

import { Environments, Services } from '../types/global';

export const sovrynLinks = {
  discord: 'https://discord.gg/kBTNx4zjRf',
  telegram: 'https://t.me/SovrynBitcoin',
  twitter: 'https://twitter.com/Sovrynbtc',
  github: 'https://github.com/DistributedCollective',
  blog: 'https://www.sovryn.app/blog',
  security: 'https://sovryn.app/.well-known/security.txt',
  fees: 'https://wiki.sovryn.app/en/sovryn-dapp/fees#zero-borrowing',
};

export const sovrynAlphaLinks = {
  [Environments.Mainnet]: 'https://alpha.sovryn.app/',
  [Environments.Testnet]: 'https://alpha-test.sovryn.app',
};

export const sovrynWikiLinks = {
  root: 'https://wiki.sovryn.app/en',
  stabilityPool:
    'https://wiki.sovryn.app/en/sovryn-dapp/subprotocols/zero-zusd#stability-pool',
  ammPool: 'https://wiki.sovryn.app/en/sovryn-dapp/market-making',
  lend: 'https://wiki.sovryn.app/en/sovryn-dapp/lending',
  trade: 'https://wiki.sovryn.app/en/technical-documents/amm/sovryn-damm',
  bridge:
    'https://babelfish.gitbook.io/the-babelfish-gitbook/tutorials-and-guides/bridges',
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
export const DEFAULT_TIMEOUT_SECONDS = 5000;
export const LIQUIDATION_RESERVE_AMOUNT = 20;
export const GAS_LIMIT_OPEN_TROVE = 1_000_000;
export const GAS_LIMIT_ADJUST_TROVE = 650_000;
export const GAS_LIMIT_STABILITY_POOL = 500_000;
export const btcInSatoshis = 100000000;

// TODO: Refactor it into a similar config we have in dapp v1 (blockExplorers constant)
export const rskExplorer = {
  [Environments.Mainnet]: 'https://explorer.rsk.co',
  [Environments.Testnet]: 'https://explorer.testnet.rsk.co',
};

export const btcExplorer = {
  [Environments.Mainnet]: 'https://live.blockcypher.com/btc',
  [Environments.Testnet]: 'https://live.blockcypher.com/btc-testnet',
};

//TODO: refactor into Bitcoin asset definition later
export const Bitcoin = 'BTC';
