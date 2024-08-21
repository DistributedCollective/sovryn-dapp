import {
  createPublicClient,
  createWalletClient,
  custom,
  defineChain,
} from 'viem';

const bobTestnet = defineChain({
  id: 111,
  name: 'Bob Testnet',
  nativeCurrency: {
    name: 'Bob Testnet',
    symbol: 'tETH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://testnet.rpc.gobob.xyz'],
    },
  },
  blockExplorerUrls: ['https://testnet-explorer.gobob.xyz'],
});

export const useBlockchainClients = () => {
  const publicClient = createPublicClient({
    chain: bobTestnet,
    transport: custom((window as any).ethereum!),
  }) as any;

  const walletClient = createWalletClient({
    chain: bobTestnet,
    transport: custom((window as any).ethereum!),
  }) as any;

  return { publicClient, walletClient };
};
