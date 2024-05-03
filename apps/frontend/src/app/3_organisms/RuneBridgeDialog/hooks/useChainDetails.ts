import React from 'react';

import { BITCOIN, ETH } from '../../../../constants/currencies';
import { useCurrentChain } from '../../../../hooks/useChainStore';
import { isRskChain, isBobChain, getChainById } from '../../../../utils/chain';
import {
  getRskExplorerUrl,
  getBobExplorerUrl,
} from '../../../../utils/helpers';

export type ChainDetails = {
  supported: boolean;
  chainName: string;
  baseCurrency: string;
  explorerUrl: string;
};

export const useChainDetails = (): ChainDetails => {
  const chainId = useCurrentChain();
  return React.useMemo(() => {
    if (isRskChain(chainId)) {
      return {
        supported: true,
        chainName: 'Rootstock',
        baseCurrency: BITCOIN,
        explorerUrl: getRskExplorerUrl(),
      };
    } else if (isBobChain(chainId)) {
      return {
        supported: true,
        chainName: 'BoB',
        baseCurrency: ETH,
        explorerUrl: getBobExplorerUrl(),
      };
    } else {
      const chain = getChainById(chainId);
      return {
        supported: false,
        chainName: chain?.label || 'Unknown',
        baseCurrency: chain?.token || 'Unknown',
        explorerUrl: chain?.blockExplorerUrl || '',
      };
    }
  }, [chainId]);
};
