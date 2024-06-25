import { isBobChain, isRskChain } from '../../../utils/chain';
import { RUNES_BOB_BRIDGE_NAME, RUNES_RSK_BRIDGE_NAME } from './constants';

export const getBridgeName = (chainId: string) => {
  if (isRskChain(chainId)) {
    return RUNES_RSK_BRIDGE_NAME;
  } else if (isBobChain(chainId)) {
    return RUNES_BOB_BRIDGE_NAME;
  } else {
    return RUNES_BOB_BRIDGE_NAME; // TODO: Adjust once we have more supported chains
  }
};
