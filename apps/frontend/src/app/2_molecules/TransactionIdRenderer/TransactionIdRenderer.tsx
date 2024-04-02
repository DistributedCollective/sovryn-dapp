import React from 'react';

import { APP_CHAIN_LIST, DEFAULT_CHAIN_ID } from '../../../config/chains';

import { TxIdWithNotification } from '../TxIdWithNotification/TransactionIdWithNotification';

type TransactionIdRendererProps = {
  hash: string;
  dataAttribute?: string;
};

const chain = APP_CHAIN_LIST.find(chain => chain.id === DEFAULT_CHAIN_ID);

// todo: should accept chainId as a prop
export const TransactionIdRenderer: React.FC<TransactionIdRendererProps> = ({
  hash,
  dataAttribute,
}) => (
  <TxIdWithNotification
    href={`${chain?.blockExplorerUrl}/tx/${hash}`}
    value={hash}
    dataAttribute={dataAttribute}
  />
);
