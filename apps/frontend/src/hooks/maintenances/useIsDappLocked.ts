import { useMemo } from 'react';

import { isBobChain, isRskChain } from '../../utils/chain';
import { useCurrentChain } from '../useChainStore';
import { useMaintenance } from '../useMaintenance';

export const useIsDappLocked = () => {
  const chainId = useCurrentChain();
  const { checkMaintenances, States } = useMaintenance();
  const maintenanceStates = checkMaintenances();
  const dappLocked = useMemo(
    () =>
      isRskChain(chainId)
        ? maintenanceStates[States.FULLD2]
        : isBobChain(chainId)
        ? maintenanceStates[States.BOB_FULL]
        : false,
    [chainId, maintenanceStates, States.FULLD2, States.BOB_FULL],
  );

  return dappLocked;
};
