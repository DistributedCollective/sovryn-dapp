import { ChainIds } from '@sovryn/ethers-provider';

import { Environments, Services } from '../types/global';

export const sovrynLinks = {
  discord: 'https://discord.gg/kBTNx4zjRf',
  telegram: 'https://t.me/SovrynBitcoin',
  twitter: 'https://twitter.com/Sovrynbtc',
  github: 'https://github.com/DistributedCollective',
  wiki: 'https://wiki.sovryn.app/en/',
  dappAlpha: 'https://live.sovryn.app/',
  blog: 'https://www.sovryn.app/blog',
};

export const requiredChain = ChainIds.RSK_TESTNET;

export const APPROVAL_FUNCTION = 'approve';

export const graphRskUrl = process.env.REACT_APP_GRAPH_RSK;

export const graphZeroUrl = process.env.REACT_APP_GRAPH_ZERO;

export const servicesConfig = {
  [Environments.Testnet]: {
    [Services.Maintenance]:
      'https://maintenance-mode.test.sovryn.app/maintenance',
  },
  [Environments.Mainnet]: {
    [Services.Maintenance]: 'https://maintenance-mode.sovryn.app/maintenance',
  },
};
