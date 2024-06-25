import { ChainId } from '@sovryn/ethers-provider';

import { COMMON_SYMBOLS } from '../../../../../../../../../utils/asset';
import { isBobChain, isRskChain } from '../../../../../../../../../utils/chain';

export const getNativeCurrency = (chainId: ChainId) => {
  if (isRskChain(chainId)) {
    return COMMON_SYMBOLS.BTC;
  } else if (isBobChain(chainId)) {
    return COMMON_SYMBOLS.ETH;
  } else {
    return COMMON_SYMBOLS.ETH; // TODO: Adjust once we have more supported chains
  }
};
