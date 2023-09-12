import React from 'react';

import { t } from 'i18next';

import { SupportedTokens } from '@sovryn/contracts';
import { Decimal } from '@sovryn/utils';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import {
  BITCOIN,
  BTC_RENDER_PRECISION,
  TOKEN_RENDER_PRECISION,
} from '../../../../../constants/currencies';
import { translations } from '../../../../../locales/i18n';
import { decimalic } from '../../../../../utils/math';
import { SECONDS_IN_YEAR } from './ExtendLoanForm.constants';

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
  debtSize: string,
  duration: number,
) => {
  const aprAmount = Decimal.fromBigNumberString(apr).div(100);

  if (debtSize === '0' || apr === '0') {
    return Decimal.ZERO;
  }

  const interest = Decimal.from(debtSize)
    .div(Decimal.ONE.sub(aprAmount.mul(duration).div(SECONDS_IN_YEAR)))
    .sub(debtSize);

  return interest;
};

export const calculateRepayCollateralWithdrawn = (
  totalDebt: string,
  debtRepaid: Decimal,
  totalCollateral: string,
) => {
  const debtRepaidPercentage = Decimal.from(debtRepaid).div(totalDebt);

  return Decimal.from(totalCollateral).mul(debtRepaidPercentage);
};

export const areValuesIdentical = (
  firstValue: Decimal,
  secondValue: Decimal,
) => {
  const epsilon = 0.000000000000001;

  return Math.abs(firstValue.sub(secondValue).toNumber()) < epsilon;
};
