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
import { useCurrentChain } from '../../../hooks/useChainStore';
import { useGasPrice } from '../../../hooks/useGasPrice';
import { TransactionSteps } from './components/TransactionSteps/TransactionSteps';
import { renderNotification } from './utils';

type TransactionStepDialogProps = {
  onSuccess?: () => void;
  disableFocusTrap?: boolean;
};

export const TransactionStepDialog: FC<TransactionStepDialogProps> = ({
  onSuccess,
  disableFocusTrap = true,
}) => {
  const chainId = useCurrentChain();
  const { transactions, isOpen, setIsOpen, title } = useTransactionContext();
  const onClose = useCallback(() => setIsOpen(false), [setIsOpen]);
  const [txStatus, setTxStatus] = useState<StatusType | null>(null);
  const gasPrice = useGasPrice(chainId);

  const { addNotification } = useNotificationContext();

  useEffect(() => {
    const { success, error, pending } = StatusType;
    if (!isOpen && txStatus !== pending) {
      if (txStatus === success || txStatus === error) {
        addNotification(renderNotification(txStatus));
      }
    }
    setTxStatus(null);
  }, [isOpen, txStatus, transactions, addNotification]);

  return (
    <Dialog
      width={DialogSize.sm}
      isOpen={isOpen}
      onClose={onClose}
      disableFocusTrap={disableFocusTrap}
    >
      <DialogHeader onClose={onClose} title={title} />
      <DialogBody>
        <TransactionSteps
          transactions={transactions}
          onClose={onClose}
          onSuccess={onSuccess}
          gasPrice={gasPrice.toString()}
          onTxStatusChange={setTxStatus}
        />
      </DialogBody>
    </Dialog>
  );
};
