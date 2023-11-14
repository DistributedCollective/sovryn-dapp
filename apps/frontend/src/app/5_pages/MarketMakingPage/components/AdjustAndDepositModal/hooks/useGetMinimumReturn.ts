import { useMemo } from 'react';

import { Decimal } from '@sovryn/utils';

import { decimalic } from '../../../../../../utils/math';

const SLIPPAGE_AMOUNT = 5;

export const useMinReturn = (amount: Decimal) => {
  return useMemo(
    () =>
      decimalic(amount.toString())
        .sub(decimalic(amount.toString()).mul(SLIPPAGE_AMOUNT).div(100))
        .toNumber()
        .toFixed(0),
    [amount],
  );
};
