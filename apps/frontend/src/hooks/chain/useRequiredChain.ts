import { useCallback, useMemo } from 'react';

import { RSK_CHAIN_ID } from '../../config/chains';

import { getChainById } from '../../utils/chain';
import { useChainStore } from '../useChainStore';

export const useRequiredChain = (requiredChainId = RSK_CHAIN_ID) => {
  const { currentChainId, setCurrentChainId } = useChainStore();
  const requiredChain = useMemo(
    () => getChainById(requiredChainId),
    [requiredChainId],
  );

  const updateChain = useCallback(
    () => setCurrentChainId(requiredChainId),
    [requiredChainId, setCurrentChainId],
  );

  return {
    requiredChain,
    invalidChain: currentChainId !== requiredChainId,
    updateChain,
  };
};
