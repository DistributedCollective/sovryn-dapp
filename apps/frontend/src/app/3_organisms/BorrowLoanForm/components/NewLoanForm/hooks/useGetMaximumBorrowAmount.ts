import { useMemo } from 'react';

import { BigNumber } from 'ethers';

import { SupportedTokens } from '@sovryn/contracts';
import { Decimal } from '@sovryn/utils';

import { useGetMarketLiquidity } from '../../../../../5_pages/LendPage/components/LendFrame/components/LendFrameDetails/hooks/useGetMarketLiquidity';
import {
  MINIMUM_COLLATERAL_RATIO_LENDING_POOLS,
  MINIMUM_COLLATERAL_RATIO_LENDING_POOLS_SOV,
} from '../../../../../../constants/lending';
import { useQueryRate } from '../../../../../../hooks/useQueryRate';
import { decimalic } from '../../../../../../utils/math';
import { calculatePrepaidInterest } from '../NewLoanForm.utils';
import { useGetMaximumCollateralAmount } from './useGetMaximumCollateralAmount';

export const useGetMaximumBorrowAmount = (
  borrowToken: SupportedTokens,
  collateralToken: SupportedTokens,
  loanDuration: number,
  borrowApr: BigNumber,
  collateralAmount?: Decimal,
) => {
  const { availableAmount } = useGetMarketLiquidity(borrowToken);
  const { maximumCollateralAmount } =
    useGetMaximumCollateralAmount(collateralToken);

  const [collateralPriceInLoanAsset] = useQueryRate(
    collateralToken,
    borrowToken,
  );

  const collateral = useMemo(
    () =>
      !collateralAmount || collateralAmount.isZero()
        ? maximumCollateralAmount
        : collateralAmount,
    [collateralAmount, maximumCollateralAmount],
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
    () => calculatePrepaidInterest(borrowApr, maxBorrow, loanDuration),
    [borrowApr, loanDuration, maxBorrow],
  );

  const result: Decimal = useMemo(
    () =>
      Decimal.min(decimalic(availableAmount), maxBorrow)
        .sub(prepaidInterest)
        .mul(1 - 0.002),
    [availableAmount, maxBorrow, prepaidInterest],
  );

  return result;
};
