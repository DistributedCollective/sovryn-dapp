import { ChainId } from '@sovryn/ethers-provider';

import { SOVRYN_INDEXER } from '../constants/infrastructure';
import { BOB } from '../constants/infrastructure/bob';
import { SEPOLIA } from '../constants/infrastructure/sepolia';
import { Environments } from '../types/global';
import { isBobChain, isRskChain } from './chain';
import { isMainnet } from './helpers';

export const getIndexerUri = (chainId: ChainId) => {
  if (isBobChain(chainId)) {
    return BOB.indexer[
      isMainnet() ? Environments.Mainnet : Environments.Testnet
    ];
  }

  return SEPOLIA.indexer.testnet;
};

export const getSovrynIndexerUri = (chainId: ChainId) => {
  if (isBobChain(chainId) || isRskChain(chainId)) {
    return SOVRYN_INDEXER[
      isMainnet() ? Environments.Mainnet : Environments.Testnet
    ];
  }

  return SEPOLIA.indexer.testnet;
};
