import setup, { Chain, ChainIds } from '@sovryn/ethers-provider';
import { ChainId } from '@sovryn/ethers-provider';
import {
  INDEXER_URL,
  INDEXER_URL_STAGING,
  INDEXER_URL_TESTNET,
} from '@sovryn/sdk';

import bobLogo from '../assets/chains/bob.svg';
import bscLogo from '../assets/chains/bsc.svg';
import ethLogo from '../assets/chains/eth.svg';
import rskLogo from '../assets/chains/rsk.svg';
import unknownLogo from '../assets/chains/unknown.svg';
import { BOB } from '../constants/infrastructure/bob';
import { BSC } from '../constants/infrastructure/bsc';
import { ETHEREUM } from '../constants/infrastructure/eth';
import { FORK } from '../constants/infrastructure/fork';
import { RSK } from '../constants/infrastructure/rsk';
import { Environments } from '../types/global';

const IS_MAINNET = process.env.REACT_APP_NETWORK === Environments.Mainnet;
const IS_STAGING = process.env.REACT_APP_STAGING === 'true';

export enum Chains {
  RSK = 'rsk',
  BSC = 'bsc',
  BOB = 'bob',
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

export type ChainWithLogo = Chain & { icon: string; indexer?: string };

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
          indexer:
            (IS_STAGING ? INDEXER_URL_STAGING : INDEXER_URL) + '/v2/rootstock',
        },
        {
          id: ChainIds.BOB_MAINNET,
          label: 'BOB',
          token: 'ETH',
          publicRpcUrl: BOB.publicRpc[Environments.Mainnet],
          rpcUrl: BOB.rpc[Environments.Mainnet],
          blockExplorerUrl: BOB.explorer[Environments.Mainnet],
          icon: bobLogo,
          indexer:
            (IS_STAGING ? INDEXER_URL_STAGING : INDEXER_URL) + '/v2/gobob',
        },
        {
          id: ChainIds.BSC_MAINNET,
          label: 'BSC',
          token: 'BNB',
          publicRpcUrl: BSC.publicRpc[Environments.Mainnet],
          rpcUrl: BSC.rpc[Environments.Mainnet],
          blockExplorerUrl: BSC.explorer[Environments.Mainnet],
          icon: bscLogo,
        },
        {
          id: ChainIds.MAINNET,
          label: 'Ethereum',
          token: 'ETH',
          publicRpcUrl: ETHEREUM.publicRpc[Environments.Mainnet],
          rpcUrl: ETHEREUM.rpc[Environments.Mainnet],
          blockExplorerUrl: ETHEREUM.explorer[Environments.Mainnet],
          icon: ethLogo,
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
          indexer: INDEXER_URL_TESTNET + '/v2/rootstock',
        },
        {
          id: ChainIds.BOB_TESTNET,
          label: 'BOB Testnet',
          token: 'tETH',
          publicRpcUrl: BOB.publicRpc[Environments.Testnet],
          rpcUrl: BOB.rpc[Environments.Testnet],
          blockExplorerUrl: BOB.explorer[Environments.Testnet],
          icon: bobLogo,
          indexer: INDEXER_URL_TESTNET + '/v2/gobob',
        },
        {
          id: ChainIds.SEPOLIA,
          label: 'Sepolia Testnet',
          token: 'tETH',
          publicRpcUrl: ETHEREUM.publicRpc[Environments.Testnet],
          rpcUrl: ETHEREUM.rpc[Environments.Testnet],
          blockExplorerUrl: ETHEREUM.explorer[Environments.Testnet],
          icon: ethLogo,
        },
        {
          id: ChainIds.BSC_TESTNET,
          label: 'BSC Testnet',
          token: 'tBNB',
          publicRpcUrl: BSC.publicRpc[Environments.Testnet],
          rpcUrl: BSC.rpc[Environments.Testnet],
          blockExplorerUrl: BSC.explorer[Environments.Testnet],
          icon: bscLogo,
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

setup(
  APP_CHAIN_LIST.map(item => ({
    ...item,
  })),
);
