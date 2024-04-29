import React from 'react';

import { ChainIds } from '@sovryn/ethers-provider';

import { useCurrentChain } from '../../../../hooks/useChainStore';
import { useMaintenance } from '../../../../hooks/useMaintenance';

export const useRuneBridgeLocked = () => {
  const { checkMaintenance, States } = useMaintenance();
  const chainId = useCurrentChain();
  return React.useMemo(() => {
    if (
      [ChainIds.BOB_MAINNET, ChainIds.BOB_TESTNET].includes(chainId as ChainIds)
    ) {
      return checkMaintenance(States.D2_RUNE_BRIDGE_BOB);
    }
    return checkMaintenance(States.D2_RUNE_BRIDGE_RSK);
  }, [States, chainId, checkMaintenance]);
};
