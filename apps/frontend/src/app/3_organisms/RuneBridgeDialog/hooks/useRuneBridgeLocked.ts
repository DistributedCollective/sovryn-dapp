import React from 'react';

import { ChainIds } from '@sovryn/ethers-provider';

import { useCurrentChain } from '../../../../hooks/useChainStore';
import { useMaintenance } from '../../../../hooks/useMaintenance';

export const useRuneBridgeLocked = () => {
  const { checkMaintenance, States } = useMaintenance();
  const chainId = useCurrentChain();
  return React.useMemo(() => {
    const isBobChain = [ChainIds.BOB_MAINNET, ChainIds.BOB_TESTNET].includes(
      chainId as ChainIds,
    );
    const currentState = isBobChain
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
