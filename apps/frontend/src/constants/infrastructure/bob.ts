import { Environments } from '../../types/global';

const rpc = {
  [Environments.Mainnet]: 'https://rpc.gobob.xyz',
  [Environments.Testnet]: 'https://bob-sepolia.rpc.gobob.xyz',
};

export const BOB = {
  rpc,
  publicRpc: rpc,
  explorer: {
    [Environments.Mainnet]: 'https://explorer.gobob.xyz',
    [Environments.Testnet]: 'https://bob-sepolia.explorer.gobob.xyz',
  },
  indexer: {
    [Environments.Mainnet]: 'https://bob-ambient-graphcache.sovryn.app/gcgo',
    [Environments.Testnet]:
      'https://bob-ambient-graphcache.test.sovryn.app/gcgo',
  },
  sdex: {
    [Environments.Mainnet]: 'https://indexer.sovryn.app',
    [Environments.Testnet]: 'https://indexer.test.sovryn.app',
  },
  bridge: {
    [Environments.Mainnet]: 'https://app.gobob.xyz/bridge',
    [Environments.Testnet]: 'https://testnet.gobob.xyz',
  },
  subgraph: {
    [Environments.Mainnet]:
      'https://bob-ambient-subgraph.sovryn.app/subgraphs/name/DistributedCollective/bob-ambient-subgraph',
    [Environments.Testnet]:
      'https://bob-ambient-subgraph.test.sovryn.app/subgraphs/name/DistributedCollective/bob-ambient-subgraph',
  },
};
