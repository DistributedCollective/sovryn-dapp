import { useMemo } from 'react';

import { Decimal } from '@sovryn/utils';

import { useDepositContext } from '../contexts/BobDepositModalContext';
import { useGetMaxDeposit } from './useGetMaxDeposit';

export const useValidateDepositAmounts = (base: string, quote: string) => {
  const { firstAssetValue, secondAssetValue } = useDepositContext();
  const { balanceTokenA, balanceTokenB } = useGetMaxDeposit(base, quote);

  const isFirstAssetValueInvalid = useMemo(
    () =>
      firstAssetValue !== null &&
      !['', '0'].includes(firstAssetValue) &&
      Decimal.from(firstAssetValue).gt(balanceTokenA),
    [balanceTokenA, firstAssetValue],
  );

  const isSecondAssetValueInvalid = useMemo(
    () =>
      secondAssetValue !== null &&
      !['', '0'].includes(secondAssetValue) &&
      Decimal.from(secondAssetValue).gt(balanceTokenB),
    [balanceTokenB, secondAssetValue],
  );

  return { isFirstAssetValueInvalid, isSecondAssetValueInvalid };
};
