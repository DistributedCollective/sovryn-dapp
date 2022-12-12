import { AmountType } from './types';

export const normalizeAmountByType = (
  amount: number,
  amountType: AmountType,
) => {
  if (amountType === AmountType.Add) {
    return Math.abs(amount);
  }
  return Math.abs(amount) * -1;
};
