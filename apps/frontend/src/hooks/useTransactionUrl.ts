import { useMemo } from 'react';

import { ChainId } from '../types/chain-id';
import { blockExplorers } from '../utils/classifiers';

export const useTransactionUrl = (
  hash: string,
  chainId: ChainId = ChainId.RSK_MAINNET,
  isNativeBtc: boolean = false,
  isAddress: boolean = false,
) => {
  const blockExplorerUrl = useMemo(() => {
    if (isNativeBtc) {
      return blockExplorers[`btc_${chainId}`];
    }
    return blockExplorers[chainId];
  }, [isNativeBtc, chainId]);

  return isAddress
    ? `${blockExplorerUrl}/address/${hash}`
    : `${blockExplorerUrl}/tx/${hash}`;
};
