import { useMemo } from 'react';

import { getChainLabel } from '../../utils/chain';
import { useChainStore } from '../useChainStore';

export const useCurrentChainLabel = () => {
  const { currentChainId } = useChainStore();
  const label = useMemo(() => getChainLabel(currentChainId), [currentChainId]);
  return {
    label,
    currentChainId,
  };
};
