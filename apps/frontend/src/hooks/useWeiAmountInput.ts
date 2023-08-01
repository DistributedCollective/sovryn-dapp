import { Dispatch, SetStateAction, useMemo, useState } from 'react';

import { BigNumber, BigNumberish } from 'ethers';

import { Decimal, Decimalish } from '@sovryn/utils';

import { toWei } from '../utils/math';

type WeiAmountInput<T> = [T, Dispatch<SetStateAction<T>>, BigNumber];

export const useWeiAmountInput = <T = Decimalish>(
  initialValue: T,
  unitName?: BigNumberish,
): WeiAmountInput<T> => {
  const [value, setValue] = useState(initialValue);
  const amount = useMemo(
    () =>
      toWei(
        Decimal.from(String(value || '0')).toString() as BigNumberish,
        unitName,
      ),
    [unitName, value],
  );

  return [value, setValue, amount];
};
