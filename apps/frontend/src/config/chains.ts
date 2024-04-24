import setup, { Chain, ChainIds } from '@sovryn/ethers-provider';
import { ChainId } from '@sovryn/ethers-provider';

import bobLogo from '../assets/chains/bob.svg';
import rskLogo from '../assets/chains/rsk.svg';
import unknownLogo from '../assets/chains/unknown.svg';
import { BOB } from '../constants/infrastructure/bob';
import { FORK } from '../constants/infrastructure/fork';
import { RSK } from '../constants/infrastructure/rsk';
import { SEPOLIA } from '../constants/infrastructure/sepolia';
import { Environments } from '../types/global';

const IS_MAINNET = process.env.REACT_APP_NETWORK === Environments.Mainnet;

export enum Chains {
  RSK = 'rsk',
  BSC = 'bsc',
}

export const DEFAULT_CHAIN_ID = (
  IS_MAINNET ? ChainIds.RSK_MAINNET : ChainIds.RSK_TESTNET
) as ChainId;

export const RSK_CHAIN_ID = (
  IS_MAINNET ? ChainIds.RSK_MAINNET : ChainIds.RSK_TESTNET
) as ChainId;

export const BOB_CHAIN_ID = (
  IS_MAINNET ? ChainIds.BOB_MAINNET : ChainIds.BOB_TESTNET
) as ChainId;

export type ChainWithLogo = Chain & { icon: string };

export const APP_CHAIN_LIST: ChainWithLogo[] = [
  ...(IS_MAINNET
    ? [
        {
          id: ChainIds.RSK_MAINNET,
          label: 'RSK',
          token: 'RBTC',
          publicRpcUrl: RSK.publicRpc[Environments.Mainnet],
          rpcUrl: RSK.rpc[Environments.Mainnet],
          blockExplorerUrl: RSK.explorer[Environments.Mainnet],
          icon: rskLogo,
        },
        {
          id: ChainIds.BOB_MAINNET,
          label: 'BOB',
          token: 'ETH',
          publicRpcUrl: BOB.publicRpc[Environments.Mainnet],
          rpcUrl: BOB.rpc[Environments.Mainnet],
          blockExplorerUrl: BOB.explorer[Environments.Mainnet],
          icon: bobLogo,
        },
      ]
    : [
        {
          id: ChainIds.RSK_TESTNET,
          label: 'RSK Testnet',
          token: 'tRBTC',
          publicRpcUrl: RSK.publicRpc[Environments.Testnet],
          rpcUrl: RSK.rpc[Environments.Testnet],
          blockExplorerUrl: RSK.explorer[Environments.Testnet],
          icon: rskLogo,
        },
        {
          id: ChainIds.BOB_TESTNET,
          label: 'BOB Testnet',
          token: 'tETH',
          publicRpcUrl: BOB.publicRpc[Environments.Testnet],
          rpcUrl: BOB.rpc[Environments.Testnet],
          blockExplorerUrl: BOB.explorer[Environments.Testnet],
          icon: bobLogo,
        },
        {
          id: ChainIds.SEPOLIA,
          label: 'Sepolia Testnet',
          token: 'tETH',
          publicRpcUrl: SEPOLIA.publicRpc[Environments.Testnet],
          rpcUrl: SEPOLIA.rpc[Environments.Testnet],
          blockExplorerUrl: SEPOLIA.explorer[Environments.Testnet],
          icon: unknownLogo,
        },
        {
          id: ChainIds.FORK,
          label: 'Virtual Network',
          token: 'tETH',
          publicRpcUrl: FORK.publicRpc[Environments.Testnet],
          rpcUrl: FORK.rpc[Environments.Testnet],
          blockExplorerUrl: FORK.explorer[Environments.Testnet],
          icon: unknownLogo,
        },
      ]),
];

setup(APP_CHAIN_LIST);
