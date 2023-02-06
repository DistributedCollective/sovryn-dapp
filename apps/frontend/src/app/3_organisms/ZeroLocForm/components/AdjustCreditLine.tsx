import React, { useCallback, useMemo, useState, FC } from 'react';

import { BigNumber } from 'ethers';
import { useTranslation } from 'react-i18next';

import { SupportedTokens } from '@sovryn/contracts';

import { ErrorData, ErrorLevel } from '../../../1_atoms/ErrorBadge/ErrorBadge';
import { BORROW_ASSETS } from '../../../5_pages/ZeroPage/constants';
import { useAssetBalance } from '../../../../hooks/useAssetBalance';
import { useGasPrice } from '../../../../hooks/useGasPrice';
import { translations } from '../../../../locales/i18n';
import { GAS_LIMIT_BLOCK } from '../../../../utils/constants';
import { composeGas } from '../../../../utils/helpers';
import { formatValue, fromWei, toWei } from '../../../../utils/math';
import {
  CRITICAL_COLLATERAL_RATIO,
  MINIMUM_COLLATERAL_RATIO,
  MIN_DEBT_SIZE,
} from '../constants';
import { useZeroData } from '../hooks/useZeroData';
import { AmountType, CreditLineSubmitValue } from '../types';
import { getOriginationFeeAmount, normalizeAmountByType } from '../utils';
import { FormContent } from './FormContent';

type AdjustCreditLineProps = {
  existingCollateral: string;
  existingDebt: string;
  onSubmit: (value: CreditLineSubmitValue) => void;
  rbtcPrice: number;
  borrowingRate: number;
};

export const AdjustCreditLine: FC<AdjustCreditLineProps> = ({
  existingCollateral,
  existingDebt,
  onSubmit,
  rbtcPrice,
  borrowingRate,
}) => {
  const { tcr, isRecoveryMode } = useZeroData(rbtcPrice);

  const [debtType, setDebtType] = useState(AmountType.Add);
  const [collateralType, setCollateralType] = useState(AmountType.Add);

  const [fieldsTouched, setFieldsTouched] = useState(false);
  const [collateralAmount, setCollateralAmount] = useState('0');
  const [debtAmount, setDebtAmount] = useState('0');
  const [debtToken, setDebtToken] = useState<SupportedTokens>(BORROW_ASSETS[0]);

  const debtSize = useMemo(() => Number(debtAmount || 0), [debtAmount]);
  const collateralSize = useMemo(
    () => Number(collateralAmount || 0),
    [collateralAmount],
  );

  // todo: use hook once merged
  const { value: _maxRbtcWeiBalance } = useAssetBalance(SupportedTokens.rbtc);
  const { value: _debtTokenWeiBalance } = useAssetBalance(debtToken);

  const rbtcGasPrice = useGasPrice();

  const isIncreasingDebt = useMemo(
    () => debtType === AmountType.Add,
    [debtType],
  );

  const isIncreasingCollateral = useMemo(
    () => collateralType === AmountType.Add,
    [collateralType],
  );

  const newDebt = useMemo(
    () =>
      Number(existingDebt) +
      normalizeAmountByType(Number(debtAmount), debtType),
    [debtAmount, existingDebt, debtType],
  );

  const newCollateral = useMemo(
    () =>
      Number(existingCollateral) +
      normalizeAmountByType(Number(collateralAmount), collateralType),
    [collateralAmount, collateralType, existingCollateral],
  );

  const maxCollateralToDepositAmount = useMemo(
    () =>
      Number(
        fromWei(
          BigNumber.from(_maxRbtcWeiBalance)
            .sub(composeGas(rbtcGasPrice || '0', GAS_LIMIT_BLOCK))
            .toString(),
        ),
      ),
    [_maxRbtcWeiBalance, rbtcGasPrice],
  );
  const maxCollateralToWithdrawAmount = useMemo(
    () =>
      Math.max(
        Number(existingCollateral) -
          (newDebt *
            (isRecoveryMode
              ? CRITICAL_COLLATERAL_RATIO
              : MINIMUM_COLLATERAL_RATIO)) /
            rbtcPrice,
        0,
      ),
    [existingCollateral, isRecoveryMode, newDebt, rbtcPrice],
  );

  const maxCollateralAmount = useMemo(
    () =>
      isIncreasingCollateral
        ? maxCollateralToDepositAmount
        : maxCollateralToWithdrawAmount,
    [
      isIncreasingCollateral,
      maxCollateralToDepositAmount,
      maxCollateralToWithdrawAmount,
    ],
  );

  const maxBorrowAmount = useMemo(() => {
    const collateral =
      (collateralSize === 0 ? maxCollateralToDepositAmount : collateralSize) +
      Number(existingCollateral);

    const amount =
      (collateral * rbtcPrice) /
      (isRecoveryMode ? CRITICAL_COLLATERAL_RATIO : MINIMUM_COLLATERAL_RATIO);

    const originationFee = getOriginationFeeAmount(amount, borrowingRate);

    return Math.max(amount - originationFee - Number(existingDebt), 0);
  }, [
    borrowingRate,
    collateralSize,
    existingCollateral,
    existingDebt,
    isRecoveryMode,
    maxCollateralToDepositAmount,
    rbtcPrice,
  ]);

  const maxRepayAmount = useMemo(
    () =>
      Math.min(
        Number(fromWei(_debtTokenWeiBalance)),
        Number(existingDebt) - MIN_DEBT_SIZE,
      ),
    [_debtTokenWeiBalance, existingDebt],
  );

  const maxDebtAmount = useMemo(
    () => (isIncreasingDebt ? maxBorrowAmount : maxRepayAmount),
    [isIncreasingDebt, maxBorrowAmount, maxRepayAmount],
  );

  const originationFee = useMemo(() => {
    if (isIncreasingDebt) {
      return getOriginationFeeAmount(debtSize, borrowingRate);
    }
    return 0;
  }, [borrowingRate, debtSize, isIncreasingDebt]);

  const initialRatio = useMemo(
    () =>
      ((Number(existingCollateral) * rbtcPrice) / Number(existingDebt)) * 100,
    [existingCollateral, existingDebt, rbtcPrice],
  );

  const ratio = useMemo(() => {
    return ((newCollateral * rbtcPrice) / newDebt) * 100;
  }, [newCollateral, newDebt, rbtcPrice]);

  const { t } = useTranslation();

  const initialLiquidationPrice = useMemo(
    () =>
      MINIMUM_COLLATERAL_RATIO *
      (Number(existingDebt) / Number(existingCollateral)),
    [existingDebt, existingCollateral],
  );
  const initialLiquidationPriceInRecoveryMode = useMemo(
    () =>
      CRITICAL_COLLATERAL_RATIO *
      (Number(existingDebt) / Number(existingCollateral)),
    [existingCollateral, existingDebt],
  );

  const liquidationPrice = useMemo(
    () => MINIMUM_COLLATERAL_RATIO * (newDebt / newCollateral),
    [newDebt, newCollateral],
  );
  const liquidationPriceInRecoveryMode = useMemo(
    () => CRITICAL_COLLATERAL_RATIO * (newDebt / newCollateral),
    [newDebt, newCollateral],
  );

  const errors = useMemo(() => {
    if (!fieldsTouched) {
      return [];
    }
    const list: ErrorData[] = [];

    const userRatio = ratio / 100;
    const tcrPlus10 = tcr * 1.1;

    const tcrPercent = formatValue(tcr * 100, 2);
    const tcrPlus10Percent = formatValue(tcrPlus10 * 100, 2);
    const ccrPercent = formatValue(CRITICAL_COLLATERAL_RATIO * 100, 2);
    const mcrPercent = formatValue(MINIMUM_COLLATERAL_RATIO * 100, 2);

    if (newDebt < MIN_DEBT_SIZE) {
      list.push({
        level: ErrorLevel.Critical,
        message: isIncreasingDebt
          ? 'The new debt amount has to be at least 200 ZUSD'
          : 'Total debt must be at least 200 ZUSD',
        weight: 5,
      });
    }

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
  }, [fieldsTouched, ratio, tcr, newDebt, isIncreasingDebt, t]);

  const debtError = useMemo(() => {
    if (!fieldsTouched) {
      return undefined;
    }

    if (
      toWei(debtAmount).gt(toWei(maxDebtAmount)) &&
      debtType === AmountType.Remove
    ) {
      const diff = Number(fromWei(toWei(debtAmount).sub(toWei(maxDebtAmount))));
      return t(translations.zeroPage.loc.errors.repayBalanceTooLow, {
        value: formatValue(diff, 4),
        currency: debtToken.toUpperCase(),
      });
    }

    if (
      toWei(debtAmount).gt(toWei(maxDebtAmount)) &&
      debtType === AmountType.Add
    ) {
      const diff = Number(fromWei(toWei(debtAmount).sub(toWei(maxDebtAmount))));
      return t(translations.zeroPage.loc.errors.creditBalanceTooLow, {
        value: formatValue(diff, 4),
        currency: debtToken.toUpperCase(),
      });
    }

    return undefined;
  }, [debtAmount, debtToken, debtType, fieldsTouched, maxDebtAmount, t]);

  const collateralError = useMemo(() => {
    if (!fieldsTouched) {
      return undefined;
    }

    if (
      collateralSize > maxCollateralToDepositAmount &&
      isIncreasingCollateral
    ) {
      const diff = collateralSize - maxCollateralToDepositAmount;
      return t(translations.zeroPage.loc.errors.balanceTooLow, {
        value: `${formatValue(diff, 4)} ${SupportedTokens.rbtc.toUpperCase()}`,
      });
    }

    if (
      collateralSize > maxCollateralToWithdrawAmount &&
      !isIncreasingCollateral
    ) {
      const diff = collateralSize - maxCollateralToWithdrawAmount;
      return t(translations.zeroPage.loc.errors.withdrawBalanceTooLow, {
        value: `${formatValue(diff, 4)} ${SupportedTokens.rbtc.toUpperCase()}`,
      });
    }

    return undefined;
  }, [
    fieldsTouched,
    collateralSize,
    maxCollateralToDepositAmount,
    isIncreasingCollateral,
    t,
    maxCollateralToWithdrawAmount,
  ]);

  const handleFormEdit = useCallback(() => setFieldsTouched(true), []);

  const handleFormSubmit = useCallback(() => {
    let value: Partial<CreditLineSubmitValue> = {
      token: debtToken,
    };

    value[isIncreasingCollateral ? 'depositCollateral' : 'withdrawCollateral'] =
      collateralAmount;
    value[isIncreasingDebt ? 'borrow' : 'repay'] = debtAmount;

    onSubmit(value as CreditLineSubmitValue);
  }, [
    collateralAmount,
    debtAmount,
    debtToken,
    isIncreasingCollateral,
    isIncreasingDebt,
    onSubmit,
  ]);

  return (
    <FormContent
      hasTrove={true}
      rbtcPrice={rbtcPrice}
      borrowingRate={borrowingRate}
      originationFee={originationFee}
      existingCollateral={existingCollateral}
      existingDebt={existingDebt}
      debtAmount={debtAmount}
      maxDebtAmount={maxDebtAmount}
      onDebtAmountChange={setDebtAmount}
      debtToken={debtToken}
      onDebtTokenChange={setDebtToken}
      debtType={debtType}
      onDebtTypeChange={setDebtType}
      collateralAmount={collateralAmount}
      maxCollateralAmount={maxCollateralAmount}
      onCollateralAmountChange={setCollateralAmount}
      collateralType={collateralType}
      onCollateralTypeChange={setCollateralType}
      initialRatio={initialRatio}
      currentRatio={ratio}
      initialLiquidationPrice={initialLiquidationPrice}
      liquidationPrice={liquidationPrice}
      initialLiquidationPriceInRecoveryMode={
        initialLiquidationPriceInRecoveryMode
      }
      liquidationPriceInRecoveryMode={liquidationPriceInRecoveryMode}
      totalDebt={newDebt}
      totalCollateral={newCollateral}
      onFormEdit={handleFormEdit}
      onFormSubmit={handleFormSubmit}
      debtError={debtError}
      collateralError={collateralError}
      errors={errors}
    />
  );
};
