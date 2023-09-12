import { Dispatch, SetStateAction, useMemo, useState } from 'react';

import { Decimal, Decimalish } from '@sovryn/utils';

type DecimalAmountInput<T> = [T, Dispatch<SetStateAction<T>>, Decimal];

export const useDecimalAmountInput = <T = Decimalish>(
  initialValue: T,
): DecimalAmountInput<T> => {
  const [value, setValue] = useState(initialValue);
  const amount = useMemo(() => {
    try {
      return Decimal.from(String(value || 0));
    } catch {
      return Decimal.ZERO;
    }
  }, [value]);

  return [value, setValue, amount];
};
