import { useMemo } from 'react';

import { ChainId } from '../types/chain-id';
import { blockExplorers, currentChainId } from '../utils/classifiers';

export const useTransactionUrl = (
  hash: string,
  chainId: ChainId = currentChainId,
  isNativeBtc: boolean = false,
  isAddress: boolean = false,
) => {
  const blockExplorerUrl = useMemo(() => {
    if (isNativeBtc) {
      return blockExplorers[`btc_${currentChainId}`];
    }
    return blockExplorers[chainId];
  }, [isNativeBtc, chainId]);

  return isAddress
    ? `${blockExplorerUrl}/address/${hash}`
    : `${blockExplorerUrl}/tx/${hash}`;
};
