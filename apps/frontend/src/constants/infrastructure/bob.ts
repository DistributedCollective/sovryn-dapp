import { Environments } from '../../types/global';

const rpc = {
  [Environments.Mainnet]: 'https://rpc.gobob.xyz',
  [Environments.Testnet]: 'https://bob-sepolia.rpc.caldera.xyz/http',
};

export const BOB = {
  rpc,
  publicRpc: rpc,
  explorer: {
    [Environments.Mainnet]: 'https://explorer.gobob.xyz',
    [Environments.Testnet]: 'https://bob-sepolia.explorer.caldera.xyz',
  },
  relayer: {
    [Environments.Mainnet]: 'https://gsn-relay.gobob.xyz',
    [Environments.Testnet]: 'https://gsn-relay-sepolia.gobob.xyz',
  },
  bundler: {
    [Environments.Mainnet]: 'https://bundler.gobob.xyz',
    [Environments.Testnet]: 'https://bundler-sepolia.gobob.xyz',
  },
};
