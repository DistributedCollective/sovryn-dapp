import { ChainIds } from '@sovryn/ethers-provider';

import { isMainnet } from './helpers';

export const getRskChainId = () =>
  isMainnet() ? ChainIds.RSK_MAINNET : ChainIds.RSK_TESTNET;
