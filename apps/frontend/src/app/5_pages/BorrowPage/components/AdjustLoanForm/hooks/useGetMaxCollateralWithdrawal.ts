import { useMemo } from 'react';

import { Decimal } from '@sovryn/utils';

import { LoanItem } from '../../../../../5_pages/BorrowPage/components/OpenLoansTable/OpenLoansTable.types';
import { MINIMUM_COLLATERAL_RATIO_BORROWING_MAINTENANCE } from '../../../../../../constants/lending';
import { useGetRBTCPrice } from '../../../../../../hooks/zero/useGetRBTCPrice';
import { COMMON_SYMBOLS } from '../../../../../../utils/asset';
import { decimalic } from '../../../../../../utils/math';
import { normalizeToken } from '../../../BorrowPage.utils';
import { useGetCollateralAssetPrice } from '../../../hooks/useGetCollateralAssetPrice';

export const useGetMaxCollateralWithdrawal = (loan: LoanItem): Decimal => {
  const borrowToken = useMemo(
    () => normalizeToken(loan.debtAsset.toLowerCase()),
    [loan.debtAsset],
  );

  const collateralToken = useMemo(
    () => normalizeToken(loan.collateralAsset.toLowerCase()),
    [loan.collateralAsset],
  );

  const { price: rbtcPrice } = useGetRBTCPrice();
  const { borrowPriceUsd, collateralPriceUsd } = useGetCollateralAssetPrice(
    borrowToken,
    collateralToken,
  );

  const collateralPriceInLoanAsset = useMemo(
    () =>
      decimalic(
        collateralToken === COMMON_SYMBOLS.BTC ? rbtcPrice : collateralPriceUsd,
      ).div(borrowToken === COMMON_SYMBOLS.BTC ? rbtcPrice : borrowPriceUsd),
    [
      borrowToken,
      borrowPriceUsd,
      collateralToken,
      collateralPriceUsd,
      rbtcPrice,
    ],
  );

  const debt = useMemo(() => loan.debt, [loan.debt]);
  const collateral = useMemo(() => loan.collateral, [loan.collateral]);

  return Decimal.from(collateral).sub(
    Decimal.from(debt)
      .mul(MINIMUM_COLLATERAL_RATIO_BORROWING_MAINTENANCE)
      .div(collateralPriceInLoanAsset),
  );
};
