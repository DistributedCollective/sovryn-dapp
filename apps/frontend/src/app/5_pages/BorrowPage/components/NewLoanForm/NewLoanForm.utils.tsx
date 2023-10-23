import { Decimal } from '@sovryn/utils';

export const calculateMargin = (
  collateral: Decimal,
  debt: Decimal,
  collateralToLoanRate: Decimal,
) => {
  if (debt.isZero()) {
    return Decimal.ZERO;
  }

  return collateral.mul(collateralToLoanRate).sub(debt).div(debt).mul(100);
};

export const calculateMaxDrawdown = (
  collateral: Decimal,
  debt: Decimal,
  margin: Decimal,
  loanToCollateralRate: Decimal,
  precision: Decimal = Decimal.from(1),
) => {
  const loanToCollateralAmount = debt.mul(loanToCollateralRate).div(precision);
  const combined = loanToCollateralAmount.add(
    loanToCollateralAmount.mul(margin).div(100),
  );

  return collateral.gt(combined) ? collateral.sub(combined) : Decimal.ZERO;
};
