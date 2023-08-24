import React, { FC, useMemo } from 'react';

import { t } from 'i18next';

import { SupportedTokens } from '@sovryn/contracts';
import {
  Dialog,
  DialogBody,
  DialogHeader,
  ErrorBadge,
  ErrorLevel,
} from '@sovryn/ui';

import { useMaintenance } from '../../../../../../../hooks/useMaintenance';
import { translations } from '../../../../../../../locales/i18n';
import { useGetBorrowMaintenance } from '../../../../hooks/useGetBorrowMaintenance';

type ExtendLoanDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const ExtendLoanDialog: FC<ExtendLoanDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const { checkMaintenance } = useMaintenance();
  // TODO: to be replaced with pool asset
  const states = useGetBorrowMaintenance(SupportedTokens.rbtc);

  const locked = useMemo(() => {
    return (
      (states.ADD_COLLATERAL && checkMaintenance(states.ADD_COLLATERAL)) ||
      checkMaintenance(states.FULL)
    );
  }, [checkMaintenance, states.ADD_COLLATERAL, states.FULL]);

  return (
    <Dialog isOpen={isOpen}>
      <DialogHeader
        title={t(translations.fixedInterestPage.extendLoanDialog.title)}
        onClose={onClose}
      ></DialogHeader>
      <DialogBody>
        Extend a loan
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
