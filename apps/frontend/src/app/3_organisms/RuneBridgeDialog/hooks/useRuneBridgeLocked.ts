import React from 'react';

import { useCurrentChain } from '../../../../hooks/useChainStore';
import { useMaintenance } from '../../../../hooks/useMaintenance';
import { isBobChain } from '../../../../utils/chain';

export const useRuneBridgeLocked = () => {
  const { checkMaintenance, States } = useMaintenance();
  const chainId = useCurrentChain();
  return React.useMemo(() => {
    const currentState = isBobChain(chainId)
      ? States.D2_RUNE_BRIDGE_BOB
      : States.D2_RUNE_BRIDGE_RSK;
    return checkMaintenance(currentState);
  }, [
    States.D2_RUNE_BRIDGE_BOB,
    States.D2_RUNE_BRIDGE_RSK,
    chainId,
    checkMaintenance,
  ]);
};
