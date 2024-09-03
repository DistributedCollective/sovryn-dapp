import {
  createPublicClient,
  createWalletClient,
  custom,
  defineChain,
  http,
} from 'viem';

const bobTestnet = defineChain({
  id: 808813,
  name: 'Bob Testnet',
  nativeCurrency: {
    name: 'Bob Testnet',
    symbol: 'tETH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://bob-sepolia.rpc.gobob.xyz'],
    },
  },
  blockExplorerUrls: ['https://testnet-explorer.gobob.xyz'],
  contracts: {
    multicall3: {
      address: '0x43aCeB7846d580877D2B98A6c3b0ea51a39a62A4',
    },
  },
});

export const useBlockchainClients = () => {
  const publicClient = createPublicClient({
    chain: bobTestnet,
    transport: http('https://bob-sepolia.rpc.gobob.xyz'),
  }) as any;

  /** @deprecated use our own wallet provider to send tx... */
  const walletClient = createWalletClient({
    chain: bobTestnet,
    transport: custom((window as any).ethereum!),
  }) as any;

  return { publicClient, walletClient };
};
