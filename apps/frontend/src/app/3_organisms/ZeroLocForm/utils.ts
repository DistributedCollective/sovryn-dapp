import { t } from 'i18next';

import { ErrorData, ErrorLevel } from '../../1_atoms/ErrorBadge/ErrorBadge';
import { translations } from '../../../locales/i18n';
import { formatValue } from '../../../utils/math';
import {
  CRITICAL_COLLATERAL_RATIO,
  MINIMUM_COLLATERAL_RATIO,
} from './constants';
import { AmountType } from './types';

export const normalizeAmountByType = (
  amount: number,
  amountType: AmountType,
) => {
  if (amountType === AmountType.Add) {
    return Math.abs(amount);
  }
  return Math.abs(amount) * -1;
};

export const getOriginationFeeAmount = (
  borrowAmount: number,
  originationFeeRate: number = 0.5,
) => (borrowAmount / (1 + originationFeeRate)) * originationFeeRate;

export const getTotalBorrowingFees = (
  borrowAmount: number,
  originationFeeRate: number = 0.5,
  liquidationReserve: number = 20,
) =>
  getOriginationFeeAmount(borrowAmount, originationFeeRate) +
  liquidationReserve;

export const getTotalDebtAmount = (
  borrowAmount: number,
  originationFeeRate: number = 0.5,
  liquidationReserve: number = 20,
) =>
  borrowAmount +
  getTotalBorrowingFees(borrowAmount, originationFeeRate, liquidationReserve);

export const checkForSystemErrors = (ratio: number, tcr: number) => {
  const list: ErrorData[] = [];

  const userRatio = ratio / 100;
  const tcrPlus10 = tcr * 1.1;

  const tcrPercent = formatValue(tcr * 100, 2);
  const tcrPlus10Percent = formatValue(tcrPlus10 * 100, 2);
  const ccrPercent = formatValue(CRITICAL_COLLATERAL_RATIO * 100, 2);
  const mcrPercent = formatValue(MINIMUM_COLLATERAL_RATIO * 100, 2);

  // System is in recovery mode:
  if (tcr && tcr <= CRITICAL_COLLATERAL_RATIO) {
    // Warning: If the system is in recovery mode and the values the user is typing
    //  are causing the collateral ratio to be less than 10% above the TCR.
    if (userRatio < tcrPlus10) {
      list.push({
        level: ErrorLevel.Warning,
        message: t(translations.zeroPage.loc.errors.ratioWarningInRecovery, {
          value: tcrPlus10Percent,
        }),
        weight: 4,
      });
    }

    // Critical: If the system is in recovery mode and the values the user is typing
    //  are causing the collateral ratio to be below the TCR.
    if (userRatio < tcr) {
      list.push({
        level: ErrorLevel.Critical,
        message: t(translations.zeroPage.loc.errors.ratioErrorInRecovery, {
          value: tcrPercent,
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
      userRatio > MINIMUM_COLLATERAL_RATIO &&
      userRatio < CRITICAL_COLLATERAL_RATIO
    ) {
      list.push({
        level: ErrorLevel.Warning,
        message: t(translations.zeroPage.loc.errors.ratioWarning, {
          value: ccrPercent,
        }),
        weight: 3,
      });
    }

    // Critical: If the system is in normal mode and the values the user is typing are causing the
    //  collateral ratio to be below the MCR (i.e., below 110%)
    if (userRatio < MINIMUM_COLLATERAL_RATIO) {
      list.push({
        level: ErrorLevel.Critical,
        message: t(translations.zeroPage.loc.errors.ratioError, {
          value: mcrPercent,
        }),
        weight: 1,
      });
    }
  }

  return list;
};
