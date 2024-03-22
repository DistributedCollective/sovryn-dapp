import React from 'react';

import dayjs from 'dayjs';
import { BigNumber } from 'ethers';
import { t } from 'i18next';

import { Decimal } from '@sovryn/utils';

import { RSK_CHAIN_ID } from '../../../config/chains';

import { AmountRenderer } from '../../2_molecules/AmountRenderer/AmountRenderer';
import {
  BTC_RENDER_PRECISION,
  TOKEN_RENDER_PRECISION,
} from '../../../constants/currencies';
import { SECONDS_IN_YEAR } from '../../../constants/general';
import {
  MINIMUM_COLLATERAL_RATIO_LENDING_POOLS_SOV,
  MINIMUM_COLLATERAL_RATIO_LENDING_POOLS,
} from '../../../constants/lending';
import { translations } from '../../../locales/i18n';
import { COMMON_SYMBOLS, findAsset } from '../../../utils/asset';
import { isBitpro, isBtcBasedAsset } from '../../../utils/helpers';
import { decimalic } from '../../../utils/math';

export const renderValue = (
  value: string,
  token: string,
  tokenPrecision?: number,
) =>
  decimalic(value).isZero() ? (
    t(translations.common.na)
  ) : (
    <AmountRenderer
      value={value}
      suffix={token}
      precision={
        !tokenPrecision
          ? token === COMMON_SYMBOLS.BTC
            ? BTC_RENDER_PRECISION
            : TOKEN_RENDER_PRECISION
          : tokenPrecision
      }
    />
  );

export const calculatePrepaidInterestFromDuration = (
  apr: BigNumber,
  debtSize: string,
  duration: number,
) => {
  if (debtSize === '0' || apr.eq('0')) {
    return Decimal.ZERO;
  }

  const aprAmount = Decimal.fromBigNumberString(apr.toString()).div(100);

  const interest = Decimal.from(debtSize)
    .div(Decimal.ONE.sub(aprAmount.mul(duration).div(SECONDS_IN_YEAR)))
    .sub(debtSize);

  return interest;
};

export const calculatePrepaidInterestFromTargetDate = (
  apr: BigNumber,
  debtSize: Decimal,
  targetDate: number,
) => {
  const currentDate = dayjs().unix();
  const duration = Math.ceil(targetDate - currentDate);

  return calculatePrepaidInterestFromDuration(
    apr,
    debtSize.toString(),
    duration,
  );
};

export const getOriginationFeeAmount = (
  collateralAmount: Decimal,
  originationFeeRate: Decimal,
) => collateralAmount.mul(originationFeeRate.div(100));

export const getCollateralRatioThresholds = (collateralToken: string) => {
  const minimumCollateralRatio =
    collateralToken === COMMON_SYMBOLS.SOV
      ? MINIMUM_COLLATERAL_RATIO_LENDING_POOLS_SOV.mul(100)
      : MINIMUM_COLLATERAL_RATIO_LENDING_POOLS.mul(100);

  return {
    START: minimumCollateralRatio.mul(0.9).toNumber(),
    MIDDLE_START: minimumCollateralRatio.toNumber() - 0.1,
    MIDDLE_END: minimumCollateralRatio.mul(1.2).toNumber(),
    END: minimumCollateralRatio.mul(1.6).toNumber(),
  };
};

export const normalizeToken = (token: string): string => {
  if (isBtcBasedAsset(token)) {
    return COMMON_SYMBOLS.BTC;
  }

  if (isBitpro(token)) {
    return COMMON_SYMBOLS.BPRO;
  }

  return findAsset(token, RSK_CHAIN_ID)?.symbol || token;
};

export const normalizeTokenWrapped = (token: string): string => {
  if (isBtcBasedAsset(token)) {
    return COMMON_SYMBOLS.WBTC;
  }

  return normalizeToken(token);
};
