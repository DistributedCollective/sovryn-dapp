import { useMemo } from 'react';

import { BigNumber } from 'ethers';

import { SupportedTokens } from '@sovryn/contracts';
import { Decimal } from '@sovryn/utils';

import {
  MINIMUM_COLLATERAL_RATIO_LENDING_POOLS,
  MINIMUM_COLLATERAL_RATIO_LENDING_POOLS_SOV,
} from '../../../../../../constants/lending';
import { useGetRBTCPrice } from '../../../../../../hooks/zero/useGetRBTCPrice';
import { decimalic } from '../../../../../../utils/math';
import { calculatePrepaidInterest } from '../NewLoanForm.utils';
import { useGetCollateralAssetPrice } from './useGetCollateralAssetPrice';
import { useGetMaximumCollateralAmount } from './useGetMaximumCollateralAmount';

export const useGetMaximumBorrowAmount = (
  borrowToken: SupportedTokens,
  collateralToken: SupportedTokens,
  loanDuration: number,
  borrowApr: BigNumber,
  collateralAmount?: Decimal,
) => {
  const { maximumCollateralAmount } =
    useGetMaximumCollateralAmount(collateralToken);

  const collateral = useMemo(
    () =>
      !collateralAmount || collateralAmount.isZero()
        ? maximumCollateralAmount
        : collateralAmount,
    [collateralAmount, maximumCollateralAmount],
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
    () => maxBorrow.sub(prepaidInterest),
    [maxBorrow, prepaidInterest],
  );

  return result;
};
