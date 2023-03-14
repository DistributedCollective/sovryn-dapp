import React, { useCallback, useMemo, useState, FC } from 'react';

import { BigNumber } from 'ethers';
import { t } from 'i18next';

import { SupportedTokens } from '@sovryn/contracts';
import { ErrorLevel } from '@sovryn/ui';

import { BORROW_ASSETS } from '../../../5_pages/ZeroPage/constants';
import { useAmountInput } from '../../../../hooks/useAmountInput';
import { useAssetBalance } from '../../../../hooks/useAssetBalance';
import { useMaxAssetBalance } from '../../../../hooks/useMaxAssetBalance';
import { translations } from '../../../../locales/i18n';
import { formatValue, fromWei, toWei } from '../../../../utils/math';
import {
  CRITICAL_COLLATERAL_RATIO,
  MINIMUM_COLLATERAL_RATIO,
  MIN_DEBT_SIZE,
} from '../constants';
import { useZeroData } from '../hooks/useZeroData';
import { AmountType, CreditLineSubmitValue } from '../types';
import {
  getOriginationFeeAmount,
  normalizeAmountByType,
  checkForSystemErrors,
} from '../utils';
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
  const [collateralAmountInput, setCollateralAmount, collateralAmount] =
    useAmountInput('');
  const [debtAmountInput, setDebtAmount, debtAmount] = useAmountInput('');
  const [debtToken, setDebtToken] = useState<SupportedTokens>(BORROW_ASSETS[0]);

  const debtSize = useMemo(() => Number(debtAmount || 0), [debtAmount]);
  const collateralSize = useMemo(
    () => Number(collateralAmount || 0),
    [collateralAmount],
  );

  const { weiBalance: _maxRbtcWeiBalance } = useMaxAssetBalance(
    SupportedTokens.rbtc,
  );
  const { weiBalance: _debtTokenWeiBalance } = useAssetBalance(debtToken);

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
      Math.max(
        Number(existingDebt) +
          normalizeAmountByType(Number(debtAmount), debtType),
        0,
      ),
    [debtAmount, existingDebt, debtType],
  );

  const newCollateral = useMemo(
    () =>
      Math.max(
        Number(existingCollateral) +
          normalizeAmountByType(Number(collateralAmount), collateralType),
        0,
      ),
    [collateralAmount, collateralType, existingCollateral],
  );

  const maxCollateralToDepositAmount = useMemo(
    () => Number(fromWei(BigNumber.from(_maxRbtcWeiBalance))),
    [_maxRbtcWeiBalance],
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
    return ((newCollateral * rbtcPrice) / newDebt) * 100 || 0;
  }, [newCollateral, newDebt, rbtcPrice]);

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
    () => MINIMUM_COLLATERAL_RATIO * (newDebt / newCollateral) || 0,
    [newDebt, newCollateral],
  );
  const liquidationPriceInRecoveryMode = useMemo(
    () => CRITICAL_COLLATERAL_RATIO * (newDebt / newCollateral) || 0,
    [newDebt, newCollateral],
  );

  const errors = useMemo(() => {
    if (!fieldsTouched) {
      return [];
    }

    const errors = checkForSystemErrors(ratio, tcr);

    if (newDebt < MIN_DEBT_SIZE) {
      errors.push({
        level: ErrorLevel.Critical,
        message: t(
          isIncreasingDebt
            ? translations.zeroPage.loc.errors.newTotalDebtTooLow
            : translations.zeroPage.loc.errors.totalDebtTooLow,
          {
            value: formatValue(MIN_DEBT_SIZE, 4),
            currency: debtToken.toUpperCase(),
          },
        ),
        weight: 3,
      });
    }

    if (isRecoveryMode) {
      if (ratio < initialRatio) {
        errors.push({
          level: ErrorLevel.Critical,
          message: t(translations.zeroPage.loc.errors.ratioDecreased, {
            value: formatValue(initialRatio, 3),
          }),
          weight: 4,
        });
      }
    }

    return errors;
  }, [
    fieldsTouched,
    ratio,
    tcr,
    newDebt,
    isRecoveryMode,
    isIncreasingDebt,
    debtToken,
    initialRatio,
  ]);

  const debtError = useMemo(() => {
    if (!fieldsTouched) {
      return undefined;
    }

    if (toWei(debtAmount).gt(_debtTokenWeiBalance) && !isIncreasingDebt) {
      return t(translations.zeroPage.loc.errors.maxExceed);
    }

    if (toWei(debtAmount).gt(toWei(maxDebtAmount)) && isIncreasingDebt) {
      return t(translations.zeroPage.loc.errors.maxExceed);
    }

    return undefined;
  }, [
    _debtTokenWeiBalance,
    debtAmount,
    fieldsTouched,
    isIncreasingDebt,
    maxDebtAmount,
  ]);

  const collateralError = useMemo(() => {
    if (!fieldsTouched) {
      return undefined;
    }

    if (
      collateralSize > maxCollateralToDepositAmount &&
      isIncreasingCollateral
    ) {
      return t(translations.zeroPage.loc.errors.maxExceed);
    }

    if (
      collateralSize > maxCollateralToWithdrawAmount &&
      !isIncreasingCollateral
    ) {
      return t(translations.zeroPage.loc.errors.maxExceed);
    }

    return undefined;
  }, [
    fieldsTouched,
    collateralSize,
    maxCollateralToDepositAmount,
    isIncreasingCollateral,
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
      debtAmount={debtAmountInput}
      maxDebtAmount={maxDebtAmount}
      onDebtAmountChange={setDebtAmount}
      debtToken={debtToken}
      onDebtTokenChange={setDebtToken}
      debtType={debtType}
      onDebtTypeChange={setDebtType}
      collateralAmount={collateralAmountInput}
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
