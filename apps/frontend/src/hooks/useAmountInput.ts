import { Dispatch, SetStateAction, useMemo, useState } from 'react';

type AmountInput<T> = [T, Dispatch<SetStateAction<T>>, T];

export const useAmountInput = <T = string>(initialValue: T): AmountInput<T> => {
  const [value, setValue] = useState(initialValue);
  const amount: T = useMemo(() => {
    let val = String(value || 0);
    const type = typeof value;
    if (val.startsWith('.')) {
      val = `0${val}`;
    }

    if (val.endsWith('.')) {
      val = `${val}0`;
    }

    if (type === 'number') {
      return Number(val) as T;
    }

    if (type === 'string') {
      return val as T;
    }

    throw new Error(`Invalid type: ${type}`);
  }, [value]);

  return [value, setValue, amount];
};
