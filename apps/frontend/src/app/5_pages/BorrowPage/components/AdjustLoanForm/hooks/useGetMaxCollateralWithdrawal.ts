import { useMemo } from 'react';

import { SupportedTokens } from '@sovryn/contracts';
import { Decimal } from '@sovryn/utils';

import { LoanItem } from '../../../../../5_pages/BorrowPage/components/OpenLoansTable/OpenLoansTable.types';
import { MINIMUM_COLLATERAL_RATIO_BORROWING_MAINTENANCE } from '../../../../../../constants/lending';
import { useGetRBTCPrice } from '../../../../../../hooks/zero/useGetRBTCPrice';
import { decimalic } from '../../../../../../utils/math';
import { normalizeToken } from '../AdjustLoanForm.utils';
import { useGetCollateralAssetPrice } from './useGetCollateralAssetPrice';

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
        collateralToken === SupportedTokens.rbtc
          ? rbtcPrice
          : collateralPriceUsd,
      ).div(borrowToken === SupportedTokens.rbtc ? rbtcPrice : borrowPriceUsd),
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
