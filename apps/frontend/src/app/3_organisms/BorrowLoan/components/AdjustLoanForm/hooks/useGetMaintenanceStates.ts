import { useMemo } from 'react';

import { SupportedTokens } from '@sovryn/contracts';

import { useGetBorrowMaintenance } from '../../../../../5_pages/BorrowPage/hooks/useGetBorrowMaintenance';
import { useMaintenance } from '../../../../../../hooks/useMaintenance';

export const useGetMaintenanceStates = (poolToken: SupportedTokens) => {
  const { checkMaintenance } = useMaintenance();
  const maintenanceStates = useGetBorrowMaintenance(poolToken);

  //   const isFullyLocked = useMemo(
  //     () => checkMaintenance(maintenanceStates.FULL),
  //     [checkMaintenance, maintenanceStates.FULL],
  //   );

  // TODO: This is just a temporary workaround so we can continue with QA until we have the correct values in admin panel
  const isFullyLocked = false;

  const isBorrowLocked = useMemo(
    () =>
      isFullyLocked ||
      (maintenanceStates.BORROW && checkMaintenance(maintenanceStates.BORROW)),
    [checkMaintenance, isFullyLocked, maintenanceStates.BORROW],
  );

  const isRepayLocked = useMemo(
    () =>
      isFullyLocked ||
      (maintenanceStates.REPAY && checkMaintenance(maintenanceStates.REPAY)),
    [checkMaintenance, isFullyLocked, maintenanceStates.REPAY],
  );

  const isCloseLocked = useMemo(
    () =>
      isFullyLocked ||
      (maintenanceStates.CLOSE && checkMaintenance(maintenanceStates.CLOSE)),
    [checkMaintenance, isFullyLocked, maintenanceStates.CLOSE],
  );

  const isAddCollateralLocked = useMemo(
    () =>
      isFullyLocked ||
      (maintenanceStates.ADD_COLLATERAL &&
        checkMaintenance(maintenanceStates.ADD_COLLATERAL)),
    [checkMaintenance, isFullyLocked, maintenanceStates.ADD_COLLATERAL],
  );

  const isWithdrawCollateralLocked = useMemo(
    () =>
      isFullyLocked ||
      (maintenanceStates.WITHDRAW_COLLATERAL &&
        checkMaintenance(maintenanceStates.WITHDRAW_COLLATERAL)),
    [checkMaintenance, isFullyLocked, maintenanceStates.WITHDRAW_COLLATERAL],
  );

  return {
    isFullyLocked,
    isBorrowLocked,
    isRepayLocked,
    isCloseLocked,
    isAddCollateralLocked,
    isWithdrawCollateralLocked,
  };
};
