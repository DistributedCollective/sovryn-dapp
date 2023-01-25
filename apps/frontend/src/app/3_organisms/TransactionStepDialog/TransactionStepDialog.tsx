import React, { FC, useCallback } from 'react';

import { Dialog, DialogBody, DialogHeader, DialogSize } from '@sovryn/ui';

import { useTransactionContext } from '../../../contexts/TransactionContext';
import { useGasPrice } from '../../../hooks/useGasPrice';
import { TransactionSteps } from './components/TransactionSteps/TransactionSteps';

type TransactionStepDialogProps = {
  onSuccess?: () => void;
};

export const TransactionStepDialog: FC<TransactionStepDialogProps> = ({
  onSuccess,
}) => {
  const { transactions, isOpen, setIsOpen, title } = useTransactionContext();
  const onClose = useCallback(() => setIsOpen(false), [setIsOpen]);
  const gasPrice = useGasPrice();

  return (
    <Dialog
      width={DialogSize.sm}
      isOpen={isOpen}
      onClose={onClose}
      disableFocusTrap
    >
      <DialogHeader onClose={onClose} title={title} />
      <DialogBody>
        <TransactionSteps
          transactions={transactions}
          onClose={onClose}
          onSuccess={onSuccess}
          gasPrice={gasPrice}
        />
      </DialogBody>
    </Dialog>
  );
};
