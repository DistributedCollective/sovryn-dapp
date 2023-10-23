import { Decimal } from '@sovryn/utils';

export const calculateDebtRepaidPercentage = (
  totalDebt: string,
  debtRepaid: Decimal,
) => Decimal.from(debtRepaid).div(totalDebt);

export const calculateRepayCollateralWithdrawn = (
  totalDebt: string,
  debtRepaid: Decimal,
  totalCollateral: string,
) =>
  Decimal.from(totalCollateral).mul(
    calculateDebtRepaidPercentage(totalDebt, debtRepaid),
  );
