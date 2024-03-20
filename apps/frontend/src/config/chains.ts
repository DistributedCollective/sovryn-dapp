import setup, { Chain, ChainIds } from '@sovryn/ethers-provider';

import {
  PUBLIC_RSK_RPC,
  RSK_EXPLORER,
  RSK_RPC,
} from '../constants/infrastructure';
import { Environments } from '../types/global';
import { isMainnet } from '../utils/helpers';

export enum Chains {
  RSK = 'rsk',
  BSC = 'bsc',
}

// export const defaultChainId = (
//   isMainnet() ? ChainIds.RSK_MAINNET : ChainIds.RSK_TESTNET
// ) as string;

export const defaultChainId = ChainIds.SEPOLIA;

// @dev: temp solution for hardware wallets to connect to the correct chain
// good enough for now, but should be refactored when cross-chain support is needed
export const chains: Chain[] = [
  isMainnet()
    ? {
        id: ChainIds.RSK_MAINNET,
        label: 'Rootstock',
        token: 'RBTC',
        publicRpcUrl: PUBLIC_RSK_RPC[Environments.Mainnet],
        rpcUrl: RSK_RPC[Environments.Mainnet],
        blockExplorerUrl: RSK_EXPLORER[Environments.Mainnet],
      }
    : {
        id: ChainIds.RSK_TESTNET,
        label: 'Rootstock testnet',
        token: 'tRBTC',
        publicRpcUrl: PUBLIC_RSK_RPC[Environments.Testnet],
        rpcUrl: RSK_RPC[Environments.Testnet],
        blockExplorerUrl: RSK_EXPLORER[Environments.Testnet],
      },
  {
    id: ChainIds.SEPOLIA,
    label: 'Sepolia',
    token: 'ETH',
    publicRpcUrl: PUBLIC_RSK_RPC[Environments.Mainnet],
    rpcUrl: RSK_RPC[Environments.Mainnet],
    blockExplorerUrl: 'https://sepolia.etherscan.io',
  },
];

setup(chains);
