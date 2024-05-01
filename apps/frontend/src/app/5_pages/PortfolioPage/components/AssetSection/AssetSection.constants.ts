import { contracts } from '@sovryn/contracts';
import { getNetworkByChainId } from '@sovryn/ethers-provider';

import { RSK_CHAIN_ID } from '../../../../../config/chains';

export const getAvailableTokens = (chainId: string = RSK_CHAIN_ID) =>
  contracts.assets[getNetworkByChainId(chainId)]?.map(item => item.symbol) ??
  [];
