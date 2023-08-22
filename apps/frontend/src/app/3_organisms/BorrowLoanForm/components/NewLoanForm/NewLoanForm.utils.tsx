import React from 'react';

import dayjs from 'dayjs';
import { t } from 'i18next';

import { SupportedTokens } from '@sovryn/contracts';
import { Decimal } from '@sovryn/utils';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import {
  BITCOIN,
  BTC_RENDER_PRECISION,
  TOKEN_RENDER_PRECISION,
} from '../../../../../constants/currencies';
import {
  MINIMUM_COLLATERAL_RATIO_LENDING_POOLS,
  MINIMUM_COLLATERAL_RATIO_LENDING_POOLS_SOV,
} from '../../../../../constants/lending';
import { translations } from '../../../../../locales/i18n';
import { decimalic } from '../../../../../utils/math';
import { SECONDS_IN_YEAR } from './NewLoanForm.constants';

export const getOriginationFeeAmount = (
  collateralAmount: Decimal,
  originationFeeRate: Decimal,
) => collateralAmount.mul(originationFeeRate);

export const renderValue = (
  value: string,
  token: SupportedTokens | string,
  tokenPrecision?: number,
) =>
  decimalic(value).isZero() ? (
    t(translations.common.na)
  ) : (
    <AmountRenderer
      value={value}
      suffix={token === SupportedTokens.rbtc ? BITCOIN : token}
      precision={
        !tokenPrecision
          ? token === SupportedTokens.rbtc
            ? BTC_RENDER_PRECISION
            : TOKEN_RENDER_PRECISION
          : tokenPrecision
      }
    />
  );

export const calculatePrepaidInterest = (
  apr: string,
  borrowSize: Decimal,
  borrowDays: number,
) => {
  const currentDate = dayjs().unix();
  const aprAmount = Decimal.fromBigNumberString(apr).div(100);
  const prepaidInterestDuration = Math.ceil(borrowDays - currentDate);

  if (borrowSize.isZero() || apr === '0') {
    return Decimal.ZERO;
  }

  const interest = borrowSize
    .div(
      Decimal.ONE.sub(
        aprAmount.mul(Math.ceil(prepaidInterestDuration)).div(SECONDS_IN_YEAR),
      ),
    )
    .sub(borrowSize);

  return interest;
};

export const getCollateralRatioThresholds = (
  collateralToken: SupportedTokens,
) => {
  const minimumCollateralRatio =
    collateralToken === SupportedTokens.sov
      ? MINIMUM_COLLATERAL_RATIO_LENDING_POOLS_SOV.mul(100)
      : MINIMUM_COLLATERAL_RATIO_LENDING_POOLS.mul(100);

  return {
    START: minimumCollateralRatio.mul(0.9).toNumber(),
    MIDDLE_START: minimumCollateralRatio.toNumber() - 0.1,
    MIDDLE_END: minimumCollateralRatio.mul(1.2).toNumber(),
    END: minimumCollateralRatio.mul(1.6).toNumber(),
  };
};
