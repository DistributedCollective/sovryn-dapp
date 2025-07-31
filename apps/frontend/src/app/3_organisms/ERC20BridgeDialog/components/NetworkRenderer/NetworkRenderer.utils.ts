import { ChainId, ChainIds } from '@sovryn/ethers-provider';

import bscLogo from '../../../../../assets/chains/bsc.svg';
import ethLogo from '../../../../../assets/chains/eth.svg';
import rskLogo from '../../../../../assets/chains/rsk.svg';
import unknownLogo from '../../../../../assets/chains/unknown.svg';

export const getNetworkIcon = (chainId: ChainId) => {
  switch (chainId) {
    case ChainIds.RSK_MAINNET:
    case ChainIds.RSK_TESTNET:
      return rskLogo;
    case ChainIds.BSC_MAINNET:
    case ChainIds.BSC_TESTNET:
      return bscLogo;
    case ChainIds.MAINNET:
    case ChainIds.ROPSTEN:
      return ethLogo;

    default:
      return unknownLogo;
  }
};
