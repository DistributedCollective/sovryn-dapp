import React from 'react';

import { chains, defaultChainId } from '../../../../../config/chains';

import { TxIdWithNotification } from '../../../../2_molecules/TxIdWithNotification/TransactionIdWithNotification';
import { Conversion } from '../../../../../utils/graphql/mynt/generated';

type TransactionIdRendererProps = {
  item: Conversion;
};

export const TransactionIdRenderer: React.FC<TransactionIdRendererProps> = ({
  item,
}) => {
  const chain = chains.find(chain => chain.id === defaultChainId);

  return (
    <TxIdWithNotification
      href={`${chain?.blockExplorerUrl}/tx/${item.transaction.id}`}
      value={item.transaction.id}
      dataAttribute="conversion-history-address-id"
    />
  );
};
