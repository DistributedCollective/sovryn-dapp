import React from 'react';

import { chains, defaultChainId } from '../../../../../config/chains';

import { TxIdWithNotification } from '../../../../2_molecules/TxIdWithNotification/TransactionIdWithNotification';

type TransactionIdRendererProps = {
  hash: string;
};

export const TransactionIdRenderer: React.FC<TransactionIdRendererProps> = ({
  hash,
}) => {
  const chain = chains.find(chain => chain.id === defaultChainId);

  return (
    <TxIdWithNotification
      href={`${chain?.blockExplorerUrl}/tx/${hash}`}
      value={hash}
      dataAttribute="conversion-history-address-id"
    />
  );
};
