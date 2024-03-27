import React, { FC, useCallback, useEffect, useState } from 'react';

import {
  Dialog,
  DialogBody,
  DialogHeader,
  DialogSize,
  StatusType,
} from '@sovryn/ui';

import { useNotificationContext } from '../../../contexts/NotificationContext';
import { useTransactionContext } from '../../../contexts/TransactionContext';
import { useGasPrice } from '../../../hooks/useGasPrice';
import { RuneBridgeTransactionSteps } from './components/TransactionSteps/RuneBridgeTransactionSteps';
import { renderNotification } from './utils';

type RuneBridgeTransactionStepDialogProps = {
  onSuccess?: () => void;
  disableFocusTrap?: boolean;
};

export const RuneBridgeTransactionStepDialog: FC<
  RuneBridgeTransactionStepDialogProps
> = ({ onSuccess, disableFocusTrap = true }) => {
  const {
    runeBridgeTransactions,
    runeBridgeIsOpen,
    setRuneBridgeIsOpen,
    title,
  } = useTransactionContext();
  const onClose = useCallback(
    () => setRuneBridgeIsOpen(false),
    [setRuneBridgeIsOpen],
  );
  const [txStatus, setTxStatus] = useState<StatusType | null>(null);
  const gasPrice = useGasPrice();

  const { addNotification } = useNotificationContext();

  useEffect(() => {
    const { success, error, pending } = StatusType;
    if (!runeBridgeIsOpen && txStatus !== pending) {
      if (txStatus === success || txStatus === error) {
        addNotification(renderNotification(txStatus));
      }
    }
    setTxStatus(null);
  }, [runeBridgeIsOpen, txStatus, runeBridgeTransactions, addNotification]);
  return (
    <Dialog
      width={DialogSize.sm}
      isOpen={runeBridgeIsOpen}
      onClose={onClose}
      disableFocusTrap={disableFocusTrap}
    >
      <DialogHeader onClose={onClose} title={title} />
      <DialogBody>
        <RuneBridgeTransactionSteps
          transactions={runeBridgeTransactions}
          onClose={onClose}
          onSuccess={onSuccess}
          gasPrice={gasPrice.toString()}
          onTxStatusChange={setTxStatus}
        />
      </DialogBody>
    </Dialog>
  );
};
