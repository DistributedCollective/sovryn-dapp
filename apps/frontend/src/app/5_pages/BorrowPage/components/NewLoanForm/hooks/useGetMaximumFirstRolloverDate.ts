import { useMemo } from 'react';

import dayjs from 'dayjs';

import { SupportedTokens } from '@sovryn/contracts';
import { Decimal } from '@sovryn/utils';

import { useGetBorrowingAPR } from '../../../../../5_pages/BorrowPage/components/AdjustLoanForm/hooks/useGetBorrowingAPR';
import { useGetRBTCPrice } from '../../../../../../hooks/zero/useGetRBTCPrice';
import { decimalic } from '../../../../../../utils/math';
import {
  DEFAULT_LOAN_DURATION,
  SECONDS_IN_DAY,
  SECONDS_IN_YEAR,
} from '../NewLoanForm.constants';
import { useGetCollateralAssetPrice } from './useGetCollateralAssetPrice';

export const useGetMaximumFirstRolloverDate = (
  collateralAmount: Decimal,
  borrowAmount: Decimal,
  collateralToken: SupportedTokens,
  borrowToken: SupportedTokens,
) => {
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
