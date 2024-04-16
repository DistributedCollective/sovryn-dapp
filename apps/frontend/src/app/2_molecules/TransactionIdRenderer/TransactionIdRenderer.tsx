import React, { useMemo } from 'react';

import { ChainId } from '@sovryn/ethers-provider';

import { APP_CHAIN_LIST, RSK_CHAIN_ID } from '../../../config/chains';

import { TxIdWithNotification } from '../TxIdWithNotification/TransactionIdWithNotification';

type TransactionIdRendererProps = {
  hash: string;
  chainId?: ChainId;
  dataAttribute?: string;
};

export const TransactionIdRenderer: React.FC<TransactionIdRendererProps> = ({
  hash,
  dataAttribute,
  chainId = RSK_CHAIN_ID,
}) => {
  const chain = useMemo(
    () => APP_CHAIN_LIST.find(chain => chain.id === chainId),
    [chainId],
  );
  return (
    <TxIdWithNotification
      href={`${chain?.blockExplorerUrl}/tx/${hash}`}
      value={hash}
      dataAttribute={dataAttribute}
    />
  );
};
