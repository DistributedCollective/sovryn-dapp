import React, { FC } from 'react';

import { AmountInput } from '@sovryn/ui';

export type TransactionGasProps = {
  limit: string;
  price: string;
};

export const TransactionGas: FC<TransactionGasProps> = ({ limit, price }) => {
  return (
    <>
      <AmountInput
        label="Gas limit"
        className="mt-2 mb-4 max-w-64"
        min={0}
        value={limit}
      />
      <AmountInput
        label="Gas price"
        unit="Gwei"
        className="mb-4 max-w-64"
        min={0}
        value={price}
      />
    </>
  );
};
