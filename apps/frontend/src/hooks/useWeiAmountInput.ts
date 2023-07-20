import { Dispatch, SetStateAction, useMemo, useState } from 'react';

import { BigNumber, BigNumberish } from 'ethers';

import { toWei } from '../utils/math';

type WeiAmountInput<T> = [T, Dispatch<SetStateAction<T>>, BigNumber];

export const useWeiAmountInput = <T = string>(
  initialValue: T,
  unitName?: BigNumberish,
): WeiAmountInput<T> => {
  const [value, setValue] = useState(initialValue);
  const amount = useMemo(
    () => toWei(String(value || 0), unitName),
    [unitName, value],
  );

  return [value, setValue, amount];
};
