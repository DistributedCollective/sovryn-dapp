import { useCallback, useMemo } from 'react';

import { APP_CHAIN_LIST, RSK_CHAIN_ID } from '../../config/chains';

import { useChainStore } from '../useChainStore';

export const useRequiredChain = (requiredChainId = RSK_CHAIN_ID) => {
  const { currentChainId, setCurrentChainId } = useChainStore();
  const requiredChain = useMemo(
    () => APP_CHAIN_LIST.find(chain => chain.id === requiredChainId),
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
