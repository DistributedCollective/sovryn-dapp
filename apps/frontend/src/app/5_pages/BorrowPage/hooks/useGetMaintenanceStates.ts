import { useMemo } from 'react';

import { SupportedTokens } from '@sovryn/contracts';

import { useMaintenance } from '../../../../hooks/useMaintenance';
import { useGetBorrowMaintenance } from './useGetBorrowMaintenance';

export const useGetMaintenanceStates = (poolToken: SupportedTokens) => {
  const { checkMaintenance } = useMaintenance();
  const maintenanceStates = useGetBorrowMaintenance(poolToken);

  const isFullyLocked = useMemo(
    () => checkMaintenance(maintenanceStates.FULL),
    [checkMaintenance, maintenanceStates.FULL],
  );

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

  const isNewLoanLocked = useMemo(
    () =>
      isFullyLocked ||
      (maintenanceStates.NEW_LOANS &&
        checkMaintenance(maintenanceStates.NEW_LOANS)),
    [checkMaintenance, isFullyLocked, maintenanceStates.NEW_LOANS],
  );

  const isExtendLocked = useMemo(
    () =>
      isFullyLocked ||
      (maintenanceStates.EXTEND && checkMaintenance(maintenanceStates.EXTEND)),
    [checkMaintenance, isFullyLocked, maintenanceStates.EXTEND],
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
    isNewLoanLocked,
    isCloseLocked,
    isExtendLocked,
    isAddCollateralLocked,
    isWithdrawCollateralLocked,
  };
};
