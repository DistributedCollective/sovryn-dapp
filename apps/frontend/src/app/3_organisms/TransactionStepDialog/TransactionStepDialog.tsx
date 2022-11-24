import React, { FC, useCallback } from 'react';

import { Dialog, DialogBody, DialogHeader, DialogSize } from '@sovryn/ui';

import { useTransactionContext } from '../../../context/transactionContext';
import { useGasPrice } from '../../../hooks/useGasPrice';
import { TransactionSteps } from './components/TransactionSteps/TransactionSteps';

export const TransactionStepDialog: FC = () => {
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
          onSuccess={onClose}
          gasPrice={gasPrice}
        />
      </DialogBody>
    </Dialog>
  );
};
