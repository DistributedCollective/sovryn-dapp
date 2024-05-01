import { Environments } from '../../types/global';

const rpc = {
  [Environments.Mainnet]: 'https://rpc.gobob.xyz',
  [Environments.Testnet]: 'https://testnet.rpc.gobob.xyz',
};

export const BOB = {
  rpc,
  publicRpc: rpc,
  explorer: {
    [Environments.Mainnet]: 'https://explorer.gobob.xyz',
    [Environments.Testnet]: 'https://testnet-explorer.gobob.xyz',
  },
  indexer: {
    [Environments.Mainnet]: 'https://bob-ambient-graphcache.sovryn.app/gcgo',
    [Environments.Testnet]:
      'https://bob-ambient-graphcache.test.sovryn.app/gcgo',
  },
  bridge: {
    [Environments.Mainnet]: 'https://app.gobob.xyz/bridge',
    [Environments.Testnet]: 'https://app.gobob.xyz/bridge',
  },
  subgraph: {
    [Environments.Mainnet]:
      'https://bob-ambient-subgraph.sovryn.app/subgraphs/name/DistributedCollective/bob-ambient-subgraph',
    [Environments.Testnet]:
      'https://bob-ambient-subgraph.test.sovryn.app/subgraphs/name/DistributedCollective/bob-ambient-subgraph',
  },
};
