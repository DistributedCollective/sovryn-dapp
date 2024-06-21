import { ChainId } from '@sovryn/ethers-provider';

import { isBobChain, isRskChain } from '../../../utils/chain';
import { ConvertHistoryType } from './ConvertHistory.types';

export const getHistoryTypeOption = (chainId: ChainId) => {
  if (isRskChain(chainId)) {
    return ConvertHistoryType.AMM;
  } else if (isBobChain(chainId)) {
    return ConvertHistoryType.BOB;
  } else {
    return ConvertHistoryType.BOB; // TODO: Change once we have more supported chains.
  }
};
