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

export const getOriginationFeeAmount = (
  borrowAmount: number,
  originationFeeRate: number = 0.5,
) => (borrowAmount / (1 + originationFeeRate)) * originationFeeRate;

export const getTotalBorrowingFees = (
  borrowAmount: number,
  originationFeeRate: number = 0.5,
  liquidationReserve: number = 20,
) =>
  getOriginationFeeAmount(borrowAmount, originationFeeRate) +
  liquidationReserve;

export const getTotalDebtAmount = (
  borrowAmount: number,
  originationFeeRate: number = 0.5,
  liquidationReserve: number = 20,
) =>
  borrowAmount +
  getTotalBorrowingFees(borrowAmount, originationFeeRate, liquidationReserve);
