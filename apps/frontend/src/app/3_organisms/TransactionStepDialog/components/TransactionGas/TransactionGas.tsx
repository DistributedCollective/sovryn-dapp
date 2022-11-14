import React, { FC } from 'react';

import { AmountInput } from '@sovryn/ui';

export type TransactionGasProps = {
  limit?: string;
  price?: string;
  className?: string;
};

export const TransactionGas: FC<TransactionGasProps> = ({
  limit,
  price,
  className,
}) => (
  <div className={className}>
    <AmountInput label="Gas limit" className="mb-4" min={0} value={limit} />
    <AmountInput label="Gas price" unit="Gwei" min={0} value={price} />
  </div>
);
