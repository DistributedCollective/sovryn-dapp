import React from 'react';

import { chains, defaultChainId } from '../../../config/chains';

import { TxIdWithNotification } from '../TxIdWithNotification/TransactionIdWithNotification';

type TransactionIdRendererProps = {
  hash: string;
};

const chain = chains.find(chain => chain.id === defaultChainId);

export const TransactionIdRenderer: React.FC<TransactionIdRendererProps> = ({
  hash,
}) => (
  <TxIdWithNotification
    href={`${chain?.blockExplorerUrl}/tx/${hash}`}
    value={hash}
    dataAttribute="conversion-history-tx-hash"
  />
);
