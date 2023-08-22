import { useMemo } from 'react';

import dayjs from 'dayjs';

import { SupportedTokens } from '@sovryn/contracts';
import { Decimal } from '@sovryn/utils';

import {
  MINIMUM_COLLATERAL_RATIO_LENDING_POOLS,
  MINIMUM_COLLATERAL_RATIO_LENDING_POOLS_SOV,
} from '../../../../../../constants/lending';
import { useMaxAssetBalance } from '../../../../../../hooks/useMaxAssetBalance';
import { useGetRBTCPrice } from '../../../../../../hooks/zero/useGetRBTCPrice';
import { decimalic } from '../../../../../../utils/math';
import { calculatePrepaidInterest } from '../NewLoanForm.utils';
import { useGetBorrowingAPR } from './useGetBorrowingAPR';
import { useGetCollateralAssetPrice } from './useGetCollateralAssetPrice';
import { useGetMaximumCollateralAmount } from './useGetMaximumCollateralAmount';

const loanDuration = 28; // TODO: It's hardcoded for now, change it later

export const useGetMaximumBorrowAmount = (
  borrowAmount: Decimal,
  borrowAsset: SupportedTokens,
  collateralAsset: SupportedTokens,
  //loanDuration?: number,
  collateralAmount?: Decimal,
) => {
  const { weiBalance: borrowAssetBalance } = useMaxAssetBalance(borrowAsset);
  const maximumCollateralAmount =
    useGetMaximumCollateralAmount(collateralAsset);

  const collateral = useMemo(
    () =>
      !collateralAmount || collateralAmount.isZero()
        ? maximumCollateralAmount
        : collateralAmount,
    [collateralAmount, maximumCollateralAmount],
  );

  const { price: rbtcPrice } = useGetRBTCPrice();

  const { borrowPriceUsd, collateralPriceUsd } = useGetCollateralAssetPrice(
    borrowAsset,
    collateralAsset,
  );

  const collateralPriceInLoanAsset = useMemo(
    () =>
      decimalic(
        collateralAsset === SupportedTokens.rbtc
          ? rbtcPrice
          : collateralPriceUsd,
      ).div(borrowAsset === SupportedTokens.rbtc ? rbtcPrice : borrowPriceUsd),
    [
      borrowAsset,
      borrowPriceUsd,
      collateralAsset,
      collateralPriceUsd,
      rbtcPrice,
    ],
  );

  const minimumCollateralRatio = useMemo(
    () =>
      collateralAsset === SupportedTokens.sov
        ? MINIMUM_COLLATERAL_RATIO_LENDING_POOLS_SOV
        : MINIMUM_COLLATERAL_RATIO_LENDING_POOLS,
    [collateralAsset],
  );

  const maximumLoanToCollateralRatio = useMemo(
    () => Decimal.ONE.div(minimumCollateralRatio),
    [minimumCollateralRatio],
  );

  const { borrowApr } = useGetBorrowingAPR(
    borrowAsset,
    !borrowAmount || borrowAmount.isZero() ? Decimal.ONE : borrowAmount,
  );

  const maxBorrow = useMemo(
    () =>
      collateral
        .mul(collateralPriceInLoanAsset)
        .mul(maximumLoanToCollateralRatio),
    [collateralPriceInLoanAsset, collateral, maximumLoanToCollateralRatio],
  );

  const prepaidInterest = useMemo(
    () =>
      calculatePrepaidInterest(
        borrowApr,
        maxBorrow,
        dayjs().add(loanDuration, 'day').unix(),
        dayjs().unix(),
      ),
    [borrowApr, maxBorrow],
  );

  const result: Decimal = useMemo(
    () => maxBorrow.sub(prepaidInterest),
    [maxBorrow, prepaidInterest],
  );

  return result.gt(Decimal.fromBigNumberString(borrowAssetBalance))
    ? Decimal.fromBigNumberString(borrowAssetBalance)
    : result;
};
