import { t } from 'i18next';

import { ErrorBadgeProps, ErrorLevel } from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { translations } from '../../../locales/i18n';
import { LIQUIDATION_RESERVE_AMOUNT } from '../../../utils/constants';
import { formatValue, numeric } from '../../../utils/math';
import {
  CRITICAL_COLLATERAL_RATIO,
  MINIMUM_COLLATERAL_RATIO,
} from './constants';
import { AmountType } from './types';

export const normalizeAmountByType = (
  amount: Decimal,
  amountType: AmountType,
) => {
  if (amountType === AmountType.Add) {
    return amount.abs();
  }
  return amount.abs().mul(-1);
};

export const getOriginationFeeAmount = (
  borrowAmount: Decimal,
  originationFeeRate: Decimal,
) => borrowAmount.mul(originationFeeRate);

export const getTotalBorrowingFees = (
  borrowAmount: Decimal,
  originationFeeRate: Decimal,
  liquidationReserve: Decimal = numeric(LIQUIDATION_RESERVE_AMOUNT),
) =>
  getOriginationFeeAmount(borrowAmount, originationFeeRate).add(
    liquidationReserve,
  );

export const getTotalDebtAmount = (
  borrowAmount: Decimal,
  originationFeeRate: Decimal,
  liquidationReserve: Decimal = numeric(LIQUIDATION_RESERVE_AMOUNT),
) =>
  borrowAmount.add(
    getTotalBorrowingFees(borrowAmount, originationFeeRate, liquidationReserve),
  );

export const checkForSystemErrors = (ratio: Decimal, tcr: Decimal) => {
  const list: ErrorBadgeProps[] = [];

  const userRatio = ratio.div(100);
  const tcrPlus10 = tcr.mul(1.1);

  const tcrPlus10Percent = formatValue(tcrPlus10.mul(100).toNumber(), 2);
  const ccrPercent = formatValue(CRITICAL_COLLATERAL_RATIO.mul(100), 2);
  const mcrPercent = formatValue(MINIMUM_COLLATERAL_RATIO.mul(100), 2);

  // System is in recovery mode:
  if (tcr && tcr.lte(CRITICAL_COLLATERAL_RATIO)) {
    // Warning: If the system is in recovery mode and the values the user is typing
    //  are causing the collateral ratio to be less than 10% above the TCR.
    if (userRatio < tcrPlus10) {
      list.push({
        level: ErrorLevel.Warning,
        message: t(translations.zeroPage.loc.errors.ratioWarningInRecovery, {
          value: tcrPlus10Percent,
        }),
        weight: 1,
      });
    }

    // Critical: If the system is in recovery mode and the values the user is typing
    //  are causing the collateral ratio to be below the TCR.
    if (userRatio.lt(CRITICAL_COLLATERAL_RATIO)) {
      list.push({
        level: ErrorLevel.Critical,
        message: t(translations.zeroPage.loc.errors.ratioErrorInRecovery, {
          value: ccrPercent,
        }),
        weight: 2,
      });
    }
  }
  // System is in normal mode:
  else {
    // Warning: If the system is in normal mode and the values the user is typing
    //  are causing the collateral ratio to be above the MCR and below the CCR (i.e., between 110% and 150%)
    if (
      userRatio.gt(MINIMUM_COLLATERAL_RATIO) &&
      userRatio.lt(CRITICAL_COLLATERAL_RATIO)
    ) {
      list.push({
        level: ErrorLevel.Warning,
        message: t(translations.zeroPage.loc.errors.ratioWarning, {
          value: ccrPercent,
        }),
        weight: 1,
      });
    }

    // Critical: If the system is in normal mode and the values the user is typing are causing the
    //  collateral ratio to be below the MCR (i.e., below 110%)
    if (userRatio.lt(MINIMUM_COLLATERAL_RATIO)) {
      list.push({
        level: ErrorLevel.Critical,
        message: t(translations.zeroPage.loc.errors.ratioError, {
          value: mcrPercent,
        }),
        weight: 2,
      });
    }
  }

  return list;
};
