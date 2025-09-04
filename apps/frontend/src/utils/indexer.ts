import { ChainId } from '@sovryn/ethers-provider';

import { SOVRYN_INDEXER } from '../constants/infrastructure';
import { BOB } from '../constants/infrastructure/bob';
import { ETHEREUM } from '../constants/infrastructure/eth';
import { Environments } from '../types/global';
import { isBobChain, isRskChain } from './chain';
import { isMainnet } from './helpers';

export const getIndexerUri = (chainId: ChainId) =>
  BOB.indexer[isMainnet() ? Environments.Mainnet : Environments.Testnet];

export const getSovrynIndexerUri = (chainId: ChainId) => {
  if (isBobChain(chainId) || isRskChain(chainId)) {
    return SOVRYN_INDEXER[
      isMainnet() ? Environments.Mainnet : Environments.Testnet
    ];
  }

  return ETHEREUM.indexer.testnet;
};
