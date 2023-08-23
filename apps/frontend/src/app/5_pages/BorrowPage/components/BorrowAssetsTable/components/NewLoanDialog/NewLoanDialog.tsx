import React, { FC, useMemo } from 'react';

import { t } from 'i18next';

import {
  Dialog,
  DialogBody,
  DialogHeader,
  ErrorBadge,
  ErrorLevel,
} from '@sovryn/ui';

import { useMaintenance } from '../../../../../../../hooks/useMaintenance';
import { translations } from '../../../../../../../locales/i18n';
import { LendingPool } from '../../../../../../../utils/LendingPool';
import { useGetBorrowMaintenance } from '../../../../hooks/useGetBorrowMaintenance';

type NewLoanDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  pool: LendingPool;
};

export const NewLoanDialog: FC<NewLoanDialogProps> = ({
  isOpen,
  onClose,
  pool,
}) => {
  const { checkMaintenance } = useMaintenance();
  const states = useGetBorrowMaintenance(pool.getAsset());

  const locked = useMemo(() => {
    return (
      (states.NEW_LOANS && checkMaintenance(states.NEW_LOANS)) ||
      checkMaintenance(states.FULL)
    );
  }, [checkMaintenance, states.FULL, states.NEW_LOANS]);

  return (
    <Dialog isOpen={isOpen}>
      <DialogHeader
        title={t(translations.fixedInterestPage.newLoanDialog.title)}
        onClose={onClose}
      ></DialogHeader>
      <DialogBody>
        Open new loan
        {locked && (
          <ErrorBadge
            level={ErrorLevel.Warning}
            message={t(translations.maintenanceMode.featureDisabled)}
          />
        )}
      </DialogBody>
    </Dialog>
  );
};
