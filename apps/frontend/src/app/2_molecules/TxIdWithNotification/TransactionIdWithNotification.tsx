import React, { FC } from 'react';

import { TransactionId, TransactionIdProps } from '@sovryn/ui';

import { useCopyAddress } from '../../../hooks/useCopyAddress';

export const TxIdWithNotification: FC<TransactionIdProps> = props => {
  const onCopyAddress = useCopyAddress();
  return <TransactionId {...props} onCopyAddress={onCopyAddress} />;
};
