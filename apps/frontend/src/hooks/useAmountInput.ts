import { Dispatch, SetStateAction, useMemo, useState } from 'react';

type AmountInput<T> = [T, Dispatch<SetStateAction<T>>, T];

export const useAmountInput = <T = string>(initialValue: T): AmountInput<T> => {
  const [value, setValue] = useState(initialValue);
  const amount: T = useMemo(() => value || (0 as T), [value]);

  return [value, setValue, amount];
};
