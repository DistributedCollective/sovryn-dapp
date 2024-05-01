import { useMemo } from 'react';

import dayjs from 'dayjs';

import { Decimal } from '@sovryn/utils';

import {
  SECONDS_IN_DAY,
  SECONDS_IN_YEAR,
} from '../../../../../../constants/general';
import { useGetRBTCPrice } from '../../../../../../hooks/zero/useGetRBTCPrice';
import { COMMON_SYMBOLS } from '../../../../../../utils/asset';
import { decimalic } from '../../../../../../utils/math';
import { useGetBorrowingAPR } from '../../../hooks/useGetBorrowingAPR';
import { useGetCollateralAssetPrice } from '../../../hooks/useGetCollateralAssetPrice';
import { DEFAULT_LOAN_DURATION } from '../NewLoanForm.constants';

export const useGetMaximumFirstRolloverDate = (
  collateralAmount: Decimal,
  borrowAmount: Decimal,
  collateralToken: string,
  borrowToken: string,
) => {
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

  const { borrowApr } = useGetBorrowingAPR(
    borrowToken,
    !borrowAmount || borrowAmount.isZero() ? Decimal.ZERO : borrowAmount,
  );

  //   const apr = useMemo(
  //     () => Decimal.fromBigNumberString(borrowApr).div(100),
  //     [borrowApr],
  //   );

  // TODO: Validate with light, this is just the best effort implementation
  const result = useMemo(
    () =>
      Decimal.from(-1)
        .mul(Decimal.from(SECONDS_IN_YEAR).div(SECONDS_IN_DAY))
        .mul(
          Decimal.ONE.div(
            Decimal.from(1.5)
              .sub(
                collateralAmount
                  .mul(collateralPriceInLoanAsset)
                  .div(borrowAmount),
              )
              .add(borrowAmount),
          )
            .sub(1)
            .div(Decimal.fromBigNumberString(borrowApr.toString())),
        ),
    [borrowAmount, borrowApr, collateralAmount, collateralPriceInLoanAsset],
  );

  const daysInFuture = useMemo(
    () =>
      Math.floor(result.toNumber()) < DEFAULT_LOAN_DURATION
        ? DEFAULT_LOAN_DURATION
        : Math.floor(result.toNumber()),
    [result],
  );

  return dayjs().add(daysInFuture, 'day').unix();
};
