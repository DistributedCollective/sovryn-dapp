import setup, { Chain, ChainIds } from '@sovryn/ethers-provider';
import { ChainId } from '@sovryn/ethers-provider';

import bobLogo from '../assets/chains/bob.svg';
import rskLogo from '../assets/chains/rsk.svg';
import {
  BOB_EXPLORER,
  BOB_RPC,
  PUBLIC_BOB_RPC,
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

export const defaultChainId = (
  isMainnet() ? ChainIds.RSK_MAINNET : ChainIds.RSK_TESTNET
) as ChainId;

export const rskChainId = (
  isMainnet() ? ChainIds.RSK_MAINNET : ChainIds.RSK_TESTNET
) as ChainId;

export const bobChainId = (
  isMainnet() ? ChainIds.BOB_MAINNET : ChainIds.BOB_TESTNET
) as ChainId;

export type ChainWithLogo = Chain & { icon: string };

export const chains: ChainWithLogo[] = [
  ...(isMainnet()
    ? [
        {
          id: ChainIds.RSK_MAINNET,
          label: 'RSK',
          token: 'RBTC',
          publicRpcUrl: PUBLIC_RSK_RPC[Environments.Mainnet],
          rpcUrl: RSK_RPC[Environments.Mainnet],
          blockExplorerUrl: RSK_EXPLORER[Environments.Mainnet],
          icon: rskLogo,
        },
        {
          id: ChainIds.BOB_MAINNET,
          label: 'BOB',
          token: 'BTC',
          publicRpcUrl: PUBLIC_BOB_RPC[Environments.Mainnet],
          rpcUrl: BOB_RPC[Environments.Mainnet],
          blockExplorerUrl: BOB_EXPLORER[Environments.Mainnet],
          icon: bobLogo,
        },
      ]
    : [
        {
          id: ChainIds.RSK_TESTNET,
          label: 'RSK',
          token: 'tRBTC',
          publicRpcUrl: PUBLIC_RSK_RPC[Environments.Testnet],
          rpcUrl: RSK_RPC[Environments.Testnet],
          blockExplorerUrl: RSK_EXPLORER[Environments.Testnet],
          icon: rskLogo,
        },
        {
          id: ChainIds.BOB_TESTNET,
          label: 'BOB',
          token: 'tBTC',
          publicRpcUrl: PUBLIC_BOB_RPC[Environments.Testnet],
          rpcUrl: BOB_RPC[Environments.Testnet],
          blockExplorerUrl: BOB_EXPLORER[Environments.Testnet],
          icon: bobLogo,
        },
      ]),
];

setup(chains);
