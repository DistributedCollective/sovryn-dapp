import setup, { Chain, ChainIds } from '@sovryn/ethers-provider';

import {
  BSC_EXPLORER,
  BSC_RPC,
  ETH_EXPLORER,
  ETH_RPC,
  RSK_EXPLORER,
  RSK_RPC,
} from '../constants/infrastructure';
import { Environments } from '../types/global';
import { isMainnet } from '../utils/helpers';

export enum Chains {
  RSK = 'rsk',
  BSC = 'bsc',
  ETH = 'eth',
}

export const defaultChainId = (
  isMainnet() ? ChainIds.RSK_MAINNET : ChainIds.RSK_TESTNET
) as string;

// @dev: temp solution for hardware wallets to connect to the correct chain
// good enough for now, but should be refactored when cross-chain support is needed
export const chains: Chain[] = [
  isMainnet()
    ? {
        id: ChainIds.RSK_MAINNET,
        label: 'Rootstock',
        token: 'RBTC',
        rpcUrl: RSK_RPC[Environments.Mainnet],
        blockExplorerUrl: RSK_EXPLORER[Environments.Mainnet],
      }
    : {
        id: ChainIds.RSK_TESTNET,
        label: 'Rootstock testnet',
        token: 'tRBTC',
        rpcUrl: RSK_RPC[Environments.Testnet],
        blockExplorerUrl: RSK_EXPLORER[Environments.Testnet],
      },
  isMainnet()
    ? {
        id: ChainIds.MAINNET,
        label: 'Ethereum',
        token: 'ETH',
        rpcUrl: ETH_RPC[Environments.Mainnet],
        blockExplorerUrl: ETH_EXPLORER[Environments.Mainnet],
      }
    : {
        id: ChainIds.SEPOLIA,
        label: 'Sepolia',
        token: 'tETH',
        rpcUrl: ETH_RPC[Environments.Testnet],
        blockExplorerUrl: ETH_EXPLORER[Environments.Testnet],
      },
  isMainnet()
    ? {
        id: ChainIds.BSC_MAINNET,
        label: 'BNB Smart Chain',
        token: 'BNB',
        rpcUrl: BSC_RPC[Environments.Mainnet],
        blockExplorerUrl: BSC_EXPLORER[Environments.Mainnet],
      }
    : {
        id: ChainIds.BSC_TESTNET,
        label: 'BNB Smart Chain testnet',
        token: 'tBNB',
        rpcUrl: BSC_RPC[Environments.Testnet],
        blockExplorerUrl: BSC_EXPLORER[Environments.Testnet],
      },
];

setup(chains);
