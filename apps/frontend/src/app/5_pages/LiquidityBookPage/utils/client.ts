import {
  createPublicClient,
  createWalletClient,
  custom,
  defineChain,
  http,
} from 'viem';

import { ChainIds, chainIdToNumber } from '@sovryn/ethers-provider';

import { BOB } from '../../../../constants/infrastructure/bob';
import { Environments } from '../../../../types/global';

const bobTestnet = defineChain({
  id: chainIdToNumber(ChainIds.BOB_TESTNET),
  name: 'Bob Testnet',
  nativeCurrency: {
    name: 'Bob Testnet',
    symbol: 'tETH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [BOB.rpc[Environments.Testnet]],
    },
  },
  blockExplorerUrls: [BOB.explorer[Environments.Testnet]],
  contracts: {
    multicall3: {
      address: '0x43aCeB7846d580877D2B98A6c3b0ea51a39a62A4',
    },
  },
});

export const useBlockchainClients = () => {
  const publicClient = createPublicClient({
    chain: bobTestnet,
    transport: http(BOB.rpc[Environments.Testnet]),
  }) as any;

  /** @deprecated use our own wallet provider to send tx... */
  const walletClient = createWalletClient({
    chain: bobTestnet,
    transport: custom((window as any).ethereum!),
  }) as any;

  return { publicClient, walletClient };
};
