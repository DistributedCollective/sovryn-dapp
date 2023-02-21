import React from 'react';

import { TransactionId } from '@sovryn/ui';

import { chains, defaultChainId } from '../../../../../config/chains';

import { useCopyAddress } from '../../../../../hooks/useCopyAddress';
import { Conversion } from '../../../../../utils/graphql/mynt/generated';

interface TransactionIdRendererProps {
  item: Conversion;
}

export const TransactionIdRenderer: React.FC<TransactionIdRendererProps> = ({
  item,
}) => {
  const onCopyAddress = useCopyAddress();
  const chain = chains.find(chain => chain.id === defaultChainId);

  return (
    <TransactionId
      href={`${chain?.blockExplorerUrl}/tx/${item.transaction.id}`}
      value={item.transaction.id}
      dataAttribute="conversion-history-address-id"
      onCopyAddress={onCopyAddress}
    />
  );
};
