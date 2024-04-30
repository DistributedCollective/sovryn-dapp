import { useMemo } from 'react';

import { isBobChain, isRskChain } from '../../utils/chain';
import { useCurrentChain } from '../useChainStore';
import { useMaintenance } from '../useMaintenance';

export const useIsDappLocked = () => {
  const chainId = useCurrentChain();
  const { checkMaintenances, States } = useMaintenance();
  const maintenanceStates = checkMaintenances();
  const dappLocked = useMemo(() => {
    if (isRskChain(chainId)) {
      return maintenanceStates[States.FULLD2];
    } else if (isBobChain(chainId)) {
      return maintenanceStates[States.BOB_FULL];
    }

    return false;
  }, [chainId, maintenanceStates, States.FULLD2, States.BOB_FULL]);

  return dappLocked;
};
