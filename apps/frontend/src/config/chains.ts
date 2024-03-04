import setup, { Chain, ChainIds } from '@sovryn/ethers-provider';
import { ChainId } from '@sovryn/ethers-provider';

import bobLogo from '../assets/chains/bob.svg';
import rskLogo from '../assets/chains/rsk.svg';
import { BOB } from '../constants/infrastructure/bob';
import { RSK } from '../constants/infrastructure/rsk';
import { Environments } from '../types/global';
import { isMainnet } from '../utils/helpers';

export enum Chains {
  RSK = 'rsk',
  BSC = 'bsc',
}

export const DEFAULT_CHAIN_ID = (
  isMainnet() ? ChainIds.RSK_MAINNET : ChainIds.RSK_TESTNET
) as ChainId;

export const RSK_CHAIN_ID = (
  isMainnet() ? ChainIds.RSK_MAINNET : ChainIds.RSK_TESTNET
) as ChainId;

export const BOB_CHAIN_ID = (
  isMainnet() ? ChainIds.BOB_MAINNET : ChainIds.BOB_TESTNET
) as ChainId;

export type ChainWithLogo = Chain & { icon: string };

export const APP_CHAIN_LIST: ChainWithLogo[] = [
  ...(isMainnet()
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
          token: 'BTC',
          publicRpcUrl: BOB.publicRpc[Environments.Mainnet],
          rpcUrl: BOB.rpc[Environments.Mainnet],
          blockExplorerUrl: BOB.explorer[Environments.Mainnet],
          icon: bobLogo,
        },
      ]
    : [
        {
          id: ChainIds.RSK_TESTNET,
          label: 'RSK',
          token: 'tRBTC',
          publicRpcUrl: RSK.publicRpc[Environments.Testnet],
          rpcUrl: RSK.rpc[Environments.Testnet],
          blockExplorerUrl: RSK.explorer[Environments.Testnet],
          icon: rskLogo,
        },
        {
          id: ChainIds.BOB_TESTNET,
          label: 'BOB',
          token: 'tBTC',
          publicRpcUrl: BOB.publicRpc[Environments.Testnet],
          rpcUrl: BOB.rpc[Environments.Testnet],
          blockExplorerUrl: BOB.explorer[Environments.Testnet],
          icon: bobLogo,
        },
      ]),
];

setup(APP_CHAIN_LIST);
