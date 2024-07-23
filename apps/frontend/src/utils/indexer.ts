import { ChainId } from '@sovryn/ethers-provider';

import { BOB } from '../constants/infrastructure/bob';
import { SEPOLIA } from '../constants/infrastructure/sepolia';
import { Environments } from '../types/global';
import { isBobChain } from './chain';
import { isMainnet } from './helpers';

export const getIndexerUri = (chainId: ChainId) => {
  if (isBobChain(chainId)) {
    return BOB.indexer[
      isMainnet() ? Environments.Mainnet : Environments.Testnet
    ];
  }

  return SEPOLIA.indexer.testnet;
};

export const getSdexUri = (chainId: ChainId) => {
  if (isBobChain(chainId)) {
    return BOB.sdex[isMainnet() ? Environments.Mainnet : Environments.Testnet];
  }

  return SEPOLIA.indexer.testnet;
};
