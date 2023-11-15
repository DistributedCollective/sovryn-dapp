import { useMemo } from 'react';

import dayjs from 'dayjs';

import { SupportedTokens } from '@sovryn/contracts';
import { Decimal } from '@sovryn/utils';

import {
  SECONDS_IN_DAY,
  SECONDS_IN_YEAR,
} from '../../../../../../constants/general';
import { useGetRBTCPrice } from '../../../../../../hooks/zero/useGetRBTCPrice';
import { decimalic, fromWei } from '../../../../../../utils/math';
import { useGetBorrowingAPR } from '../../../hooks/useGetBorrowingAPR';
import { useGetCollateralAssetPrice } from '../../../hooks/useGetCollateralAssetPrice';

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
            .div(Decimal.from(fromWei(borrowApr))),
        ),
    [borrowAmount, borrowApr, collateralAmount, collateralPriceInLoanAsset],
  );

  return dayjs().add(result.toNumber(), 'month').unix();
};
