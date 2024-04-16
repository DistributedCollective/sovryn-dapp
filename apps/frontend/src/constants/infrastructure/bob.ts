import { Environments } from '../../types/global';

const rpc = {
  [Environments.Mainnet]: '',
  [Environments.Testnet]: 'https://sepolia-dencun.rpc.gobob.xyz',
};

export const BOB = {
  rpc,
  publicRpc: rpc,
  explorer: {
    [Environments.Mainnet]: '',
    [Environments.Testnet]: 'https://sepolia-dencun.explorer.gobob.xyz',
  },
  indexer: {
    [Environments.Mainnet]: '',
    [Environments.Testnet]:
      'https://bob-ambient-graphcache.test.sovryn.app/gcgo',
  },
  bridge: {
    [Environments.Mainnet]: '',
    [Environments.Testnet]: 'https://bob-testnet.bridge.caldera.xyz',
  },
  subgraph: {
    [Environments.Mainnet]: '',
    [Environments.Testnet]:
      'https://bob-ambient-subgraph.test.sovryn.app/subgraphs/name/DistributedCollective/bob-ambient-subgraph',
  },
};
