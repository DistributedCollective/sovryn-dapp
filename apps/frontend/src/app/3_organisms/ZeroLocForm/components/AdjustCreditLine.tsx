import React, { useCallback, useMemo, useState, FC } from 'react';

import { t } from 'i18next';

import { SupportedTokens } from '@sovryn/contracts';
import { ErrorLevel } from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { BORROW_ASSETS } from '../../../5_pages/ZeroPage/constants';
import { Bitcoin } from '../../../../constants/currencies';
import { useAmountInput } from '../../../../hooks/useAmountInput';
import { useAssetBalance } from '../../../../hooks/useAssetBalance';
import { useMaxAssetBalance } from '../../../../hooks/useMaxAssetBalance';
import { translations } from '../../../../locales/i18n';
import { formatValue, decimalic } from '../../../../utils/math';
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
  existingCollateral: Decimal;
  existingDebt: Decimal;
  onSubmit: (value: CreditLineSubmitValue) => void;
  rbtcPrice: Decimal;
  borrowingRate: Decimal;
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

  const debtSize = useMemo(() => decimalic(debtAmount), [debtAmount]);
  const collateralSize = useMemo(
    () => decimalic(collateralAmount),
    [collateralAmount],
  );

  const { balance: maxCollateralToDepositAmount } = useMaxAssetBalance(
    SupportedTokens.rbtc,
  );
  const { balance: debtTokenBalance } = useAssetBalance(debtToken);

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
      Decimal.max(
        existingDebt.add(
          normalizeAmountByType(decimalic(debtAmount), debtType),
        ),
        Decimal.ZERO,
      ),
    [debtAmount, existingDebt, debtType],
  );

  const newCollateral = useMemo(
    () =>
      Decimal.max(
        existingCollateral.add(
          normalizeAmountByType(decimalic(collateralAmount), collateralType),
        ),
        Decimal.ZERO,
      ),
    [collateralAmount, collateralType, existingCollateral],
  );

  const maxCollateralToWithdrawAmount = useMemo(
    () =>
      Decimal.max(
        existingCollateral
          .sub(
            newDebt
              .mul(
                isRecoveryMode
                  ? CRITICAL_COLLATERAL_RATIO
                  : MINIMUM_COLLATERAL_RATIO,
              )
              .div(rbtcPrice),
          )
          .sub(Decimal.fromBigNumberString('1')),
        Decimal.ZERO,
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
    const collateral = collateralSize.isZero()
      ? existingCollateral
      : existingCollateral.add(collateralSize);

    const amount = collateral
      .mul(rbtcPrice)
      .div(
        isRecoveryMode ? CRITICAL_COLLATERAL_RATIO : MINIMUM_COLLATERAL_RATIO,
      );

    const originationFee = getOriginationFeeAmount(amount, borrowingRate);

    return Decimal.max(amount.sub(existingDebt).sub(originationFee), 0);
  }, [
    borrowingRate,
    collateralSize,
    existingCollateral,
    existingDebt,
    isRecoveryMode,
    rbtcPrice,
  ]);

  const maxRepayAmount = useMemo(
    () => Decimal.min(debtTokenBalance, existingDebt.sub(MIN_DEBT_SIZE)),
    [debtTokenBalance, existingDebt],
  );

  const maxDebtAmount = useMemo(
    () => (isIncreasingDebt ? maxBorrowAmount : maxRepayAmount),
    [isIncreasingDebt, maxBorrowAmount, maxRepayAmount],
  );

  const originationFee = useMemo(() => {
    if (isIncreasingDebt) {
      return getOriginationFeeAmount(debtSize, borrowingRate);
    }
    return Decimal.ZERO;
  }, [borrowingRate, debtSize, isIncreasingDebt]);

  const initialRatio = useMemo(
    () => existingCollateral.mul(rbtcPrice).div(existingDebt).mul(100),
    [existingCollateral, existingDebt, rbtcPrice],
  );

  const ratio = useMemo(
    () => newCollateral.mul(rbtcPrice).div(newDebt).mul(100),
    [newCollateral, newDebt, rbtcPrice],
  );

  const initialLiquidationPrice = useMemo(
    () => MINIMUM_COLLATERAL_RATIO.mul(existingDebt).div(existingCollateral),
    [existingDebt, existingCollateral],
  );

  const initialLiquidationPriceInRecoveryMode = useMemo(
    () => CRITICAL_COLLATERAL_RATIO.mul(existingDebt).div(existingCollateral),
    [existingCollateral, existingDebt],
  );

  const liquidationPrice = useMemo(
    () => MINIMUM_COLLATERAL_RATIO.mul(newDebt).div(newCollateral),
    [newDebt, newCollateral],
  );
  const liquidationPriceInRecoveryMode = useMemo(
    () => CRITICAL_COLLATERAL_RATIO.mul(newDebt).div(newCollateral),
    [newDebt, newCollateral],
  );

  const errors = useMemo(() => {
    if (!fieldsTouched) {
      return [];
    }

    const errors = checkForSystemErrors(ratio, tcr);

    if (newDebt.lt(MIN_DEBT_SIZE)) {
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
      const ratioRequired = Decimal.max(
        initialRatio,
        CRITICAL_COLLATERAL_RATIO,
      );
      if (ratio < ratioRequired) {
        errors.push({
          level: ErrorLevel.Critical,
          message: t(translations.zeroPage.loc.errors.ratioDecreased, {
            value: formatValue(ratioRequired, 3),
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

    if (debtSize.gt(debtTokenBalance) && !isIncreasingDebt) {
      return t(translations.zeroPage.loc.errors.maxExceed);
    }

    if (debtSize.gt(maxDebtAmount) && isIncreasingDebt) {
      return t(translations.zeroPage.loc.errors.maxExceed);
    }

    return undefined;
  }, [
    debtSize,
    debtTokenBalance,
    fieldsTouched,
    isIncreasingDebt,
    maxDebtAmount,
  ]);

  const collateralError = useMemo(() => {
    if (!fieldsTouched) {
      return undefined;
    }

    if (
      collateralSize.gt(maxCollateralToDepositAmount) &&
      isIncreasingCollateral
    ) {
      return t(translations.zeroPage.loc.errors.maxExceed);
    }

    if (
      isRecoveryMode &&
      ((isIncreasingDebt && decimalic(debtAmount).gt(Decimal.ZERO)) ||
        (!isIncreasingCollateral &&
          decimalic(collateralAmount).gt(Decimal.ZERO)))
    ) {
      const minCollateralAmount = decimalic(newDebt)
        .div(rbtcPrice)
        .mul(Decimal.max(CRITICAL_COLLATERAL_RATIO, initialRatio.div(100)));

      if (newCollateral.lt(minCollateralAmount)) {
        return t(translations.zeroPage.loc.errors.newCollateralTooLow, {
          value: `${formatValue(
            minCollateralAmount.sub(newCollateral),
            4,
            true,
          )}`,
          currency: Bitcoin,
        });
      }
    }

    if (
      collateralSize.gt(maxCollateralToWithdrawAmount) &&
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
    isRecoveryMode,
    isIncreasingDebt,
    debtAmount,
    collateralAmount,
    maxCollateralToWithdrawAmount,
    newDebt,
    rbtcPrice,
    initialRatio,
    newCollateral,
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
