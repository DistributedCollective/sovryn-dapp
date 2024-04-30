import { useMaintenance } from '../../../../hooks/useMaintenance';

export const useRuneBridgeLocked = () => {
  const { checkMaintenance, States } = useMaintenance();
  return checkMaintenance(States.D2_RUNE_BRIDGE_RSK);
};
