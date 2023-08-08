import { Dispatch, SetStateAction, useMemo, useState } from 'react';

import { BigNumber, BigNumberish } from 'ethers';

import { Decimalish } from '@sovryn/utils';

import { toWei } from '../utils/math';

type WeiAmountInput<T> = [T, Dispatch<SetStateAction<T>>, BigNumber];

export const useWeiAmountInput = <T = Decimalish>(
  initialValue: T,
  unitName?: BigNumberish,
): WeiAmountInput<T> => {
  const [value, setValue] = useState(initialValue);
  const amount = useMemo(() => {
    try {
      return toWei(String(value || 0), unitName);
    } catch {
      return toWei(String(0), unitName);
    }
  }, [unitName, value]);

  return [value, setValue, amount];
};
