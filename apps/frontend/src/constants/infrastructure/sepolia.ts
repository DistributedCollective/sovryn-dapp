import { Environments } from '../../types/global';

const rpc = {
  [Environments.Testnet]: 'https://ethereum-sepolia-rpc.publicnode.com',
};

export const SEPOLIA = {
  rpc,
  publicRpc: rpc,
  explorer: {
    [Environments.Testnet]: 'https://sepolia.etherscan.io/',
  },
  indexer: {
    [Environments.Testnet]:
      'https://sepolia-ambient-graphcache.test.sovryn.app/gcgo',
  },
  bridge: {
    [Environments.Testnet]: 'https://bob-testnet.bridge.caldera.xyz',
  },
  subgraph: {
    [Environments.Testnet]:
      'https://api.studio.thegraph.com/proxy/71652/sdex-sepolia/version/latest',
  },
};
