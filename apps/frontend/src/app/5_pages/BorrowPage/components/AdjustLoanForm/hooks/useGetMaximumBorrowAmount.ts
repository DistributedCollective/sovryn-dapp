import { useMemo } from 'react';

import { SupportedTokens } from '@sovryn/contracts';
import { Decimal } from '@sovryn/utils';

import { LoanItem } from '../../../../../5_pages/BorrowPage/components/OpenLoansTable/OpenLoansTable.types';
import {
  MINIMUM_COLLATERAL_RATIO_LENDING_POOLS,
  MINIMUM_COLLATERAL_RATIO_LENDING_POOLS_SOV,
} from '../../../../../../constants/lending';
import { useQueryRate } from '../../../../../../hooks/useQueryRate';
import { calculatePrepaidInterest } from '../../NewLoanForm/NewLoanForm.utils';
import { useGetMaximumCollateralAmount } from '../../NewLoanForm/hooks/useGetMaximumCollateralAmount';
import { normalizeToken } from '../AdjustLoanForm.utils';
import { useGetBorrowingAPR } from './useGetBorrowingAPR';

export const useGetMaximumBorrowAmount = (
  loan: LoanItem,
  collateralAmount?: Decimal,
): Decimal => {
  const borrowToken = useMemo(
    () => normalizeToken(loan.debtAsset.toLowerCase()),
    [loan.debtAsset],
  );

  const collateralToken = useMemo(
    () => normalizeToken(loan.collateralAsset.toLowerCase()),
    [loan.collateralAsset],
  );

  const { maximumCollateralAmount, loading } = useGetMaximumCollateralAmount(
    collateralToken,
    collateralAmount,
  );

  const collateral = useMemo(
    () =>
      (!collateralAmount || collateralAmount.isZero()
        ? maximumCollateralAmount
        : collateralAmount
      ).add(loan.collateral),
    [collateralAmount, loan.collateral, maximumCollateralAmount],
  );

  const debt = useMemo(() => loan.debt, [loan.debt]);

  const { borrowApr } = useGetBorrowingAPR(borrowToken, Decimal.from(debt));

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [collateralPriceInLoanAsset, precision, loadingRates] = useQueryRate(
    collateralToken,
    borrowToken,
  );

  const minimumCollateralRatio = useMemo(
    () =>
      collateralToken === SupportedTokens.sov
        ? MINIMUM_COLLATERAL_RATIO_LENDING_POOLS_SOV
        : MINIMUM_COLLATERAL_RATIO_LENDING_POOLS,
    [collateralToken],
  );

  const maximumLoanToCollateralRatio = useMemo(
    () => Decimal.ONE.div(minimumCollateralRatio),
    [minimumCollateralRatio],
  );

  const maxBorrow = useMemo(
    () =>
      collateral
        .mul(collateralPriceInLoanAsset)
        .mul(maximumLoanToCollateralRatio),
    [collateralPriceInLoanAsset, collateral, maximumLoanToCollateralRatio],
  );

  const prepaidInterest = useMemo(
    () => calculatePrepaidInterest(borrowApr, maxBorrow, loan.rolloverDate),
    [borrowApr, loan.rolloverDate, maxBorrow],
  );

  const result: Decimal = useMemo(
    () => maxBorrow.sub(prepaidInterest).sub(debt),
    [debt, maxBorrow, prepaidInterest],
  );

  if (result.lte(Decimal.ZERO) || loading || loadingRates) {
    return Decimal.ZERO;
  }

  return result;
};
