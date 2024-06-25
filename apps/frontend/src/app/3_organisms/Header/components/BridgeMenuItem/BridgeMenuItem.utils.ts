import { COMMON_SYMBOLS } from '../../../../../utils/asset';
import { isBobChain, isRskChain } from '../../../../../utils/chain';

export const getNativeTokenSymbol = (chainId: string) => {
  if (isRskChain(chainId)) {
    return COMMON_SYMBOLS.BTC;
  } else if (isBobChain(chainId)) {
    return COMMON_SYMBOLS.ETH;
  } else {
    return COMMON_SYMBOLS.ETH; // TODO: Adjust once we have more supported chains
  }
};
