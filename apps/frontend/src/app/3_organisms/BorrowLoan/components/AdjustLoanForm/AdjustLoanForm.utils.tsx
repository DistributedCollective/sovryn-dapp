import React from 'react';

import { t } from 'i18next';

import { Decimal } from '@sovryn-zero/lib-base';
import { SupportedTokens } from '@sovryn/contracts';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import {
  BITCOIN,
  BTC_RENDER_PRECISION,
  TOKEN_RENDER_PRECISION,
} from '../../../../../constants/currencies';
import { translations } from '../../../../../locales/i18n';
import { decimalic } from '../../../../../utils/math';
import { SECONDS_IN_YEAR } from './AdjustLoanForm.constants';

export const normalizeToken = (token: string) => {
  if (token.toLowerCase() === SupportedTokens.wrbtc) {
    return SupportedTokens.rbtc;
  }

  return SupportedTokens[token] || token;
};

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

export const calculatePreparedInterest = (
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
