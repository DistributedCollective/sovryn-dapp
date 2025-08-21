import { useEffect, useState } from 'react';

import { Decimal } from '@sovryn/utils';

import { decimalic } from '../../../../../../utils/math';
import { LoanItem } from '../../OpenLoansTable/OpenLoansTable.types';
import { getBorrowAmount, getMaxDrawdown } from '../AdjustLoanForm.utils';

export const useDrawdown = (
  loan: LoanItem,
  collateralSize: Decimal,
  isAddCollateralTab: boolean,
) => {
  const [drawDown, setDrawDown] = useState(Decimal.ZERO);
  const [maxBorrow, setMaxBorrow] = useState(Decimal.ZERO);

  useEffect(() => {
    getMaxDrawdown(
      loan.debtAsset,
      loan.collateralAsset,
      decimalic(loan.debt),
      decimalic(loan.collateral),
      loan.startMargin,
    ).then(setDrawDown);
  }, [
    loan.collateral,
    loan.collateralAsset,
    loan.debt,
    loan.debtAsset,
    loan.startMargin,
  ]);

  useEffect(() => {
    getBorrowAmount(
      loan.debtAsset,
      drawDown.add(collateralSize.mul(isAddCollateralTab ? 1 : -1)),
      loan.collateralAsset,
      Math.max(Math.floor(loan.rolloverDate - Date.now() / 1000), 0),
      // 28 * 86400,
    ).then(setMaxBorrow);
  }, [
    collateralSize,
    drawDown,
    isAddCollateralTab,
    loan.collateralAsset,
    loan.debtAsset,
    loan.rolloverDate,
  ]);

  return { drawDown, maxBorrow };
};
