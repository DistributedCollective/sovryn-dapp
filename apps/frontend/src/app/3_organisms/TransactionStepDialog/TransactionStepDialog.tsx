import React, { FC } from 'react';

import { Dialog, DialogBody, DialogHeader, DialogSize } from '@sovryn/ui';

import { Transaction } from './TransactionStepDialog.types';
import { TransactionSteps } from './components/TransactionSteps/TransactionSteps';

export type TransactionStepDialogProps = {
  transactions: Transaction[];
  isOpen: boolean;
  onClose: () => void;
  title: string;
};

export const TransactionStepDialog: FC<TransactionStepDialogProps> = ({
  transactions,
  title,
  isOpen,
  onClose,
}) => (
  <Dialog width={DialogSize.sm} isOpen={isOpen} onClose={onClose}>
    <DialogHeader onClose={onClose} title={title} />
    <DialogBody>
      <TransactionSteps transactions={transactions} onSuccess={onClose} />
    </DialogBody>
  </Dialog>
);
