import React, { useCallback, useMemo, useState, FC } from 'react';

import { t } from 'i18next';

import { SupportedTokens } from '@sovryn/contracts';
import { ErrorLevel } from '@sovryn/ui';

import { BORROW_ASSETS } from '../../../5_pages/ZeroPage/constants';
import { useAmountInput } from '../../../../hooks/useAmountInput';
import { useMaxAssetBalance } from '../../../../hooks/useMaxAssetBalance';
import { translations } from '../../../../locales/i18n';
import { Bitcoin } from '../../../../utils/constants';
import { formatValue, fromWei, numeric, toWei } from '../../../../utils/math';
import {
  CRITICAL_COLLATERAL_RATIO,
  MINIMUM_COLLATERAL_RATIO,
  MIN_DEBT_SIZE,
} from '../constants';
import { useZeroData } from '../hooks/useZeroData';
import { CreditLineSubmitValue } from '../types';
import {
  checkForSystemErrors,
  getOriginationFeeAmount,
  getTotalDebtAmount,
} from '../utils';
import { FormContent } from './FormContent';

export type OpenCreditLineProps = {
  onSubmit: (value: CreditLineSubmitValue) => void;
  rbtcPrice: number;
  borrowingRate: number;
};

export const OpenCreditLine: FC<OpenCreditLineProps> = ({
  onSubmit,
  rbtcPrice,
  borrowingRate,
}) => {
  const { tcr, liquidationReserve, isRecoveryMode } = useZeroData(rbtcPrice);

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

  const { weiBalance: maxRbtcWeiBalance } = useMaxAssetBalance(
    SupportedTokens.rbtc,
  );

  const originationFee = useMemo(
    () => getOriginationFeeAmount(debtSize, borrowingRate),
    [borrowingRate, debtSize],
  );

  const debtWithFees = useMemo(
    () =>
      debtSize > 0
        ? getTotalDebtAmount(debtSize, borrowingRate, liquidationReserve)
        : 0,
    [debtSize, borrowingRate, liquidationReserve],
  );

  const minCollateralAmount = useMemo(
    () =>
      (Math.max(MIN_DEBT_SIZE, debtWithFees) / rbtcPrice) *
      (isRecoveryMode ? CRITICAL_COLLATERAL_RATIO : MINIMUM_COLLATERAL_RATIO),
    [debtWithFees, isRecoveryMode, rbtcPrice],
  );

  const maxCollateralAmount = useMemo(
    () => Number(fromWei(maxRbtcWeiBalance)),
    [maxRbtcWeiBalance],
  );

  const maxDebtAmount = useMemo(() => {
    const rbtcBalance = Number(fromWei(maxRbtcWeiBalance));
    const collateral = Number(collateralAmount);

    let amount =
      (rbtcBalance * rbtcPrice) /
      (isRecoveryMode ? CRITICAL_COLLATERAL_RATIO : MINIMUM_COLLATERAL_RATIO);

    if (collateral > 0) {
      amount =
        (collateral * rbtcPrice) /
        (isRecoveryMode ? CRITICAL_COLLATERAL_RATIO : MINIMUM_COLLATERAL_RATIO);
    }

    const originationFee = getOriginationFeeAmount(amount, borrowingRate);

    return Math.max(amount - originationFee - liquidationReserve, 0);
  }, [
    borrowingRate,
    collateralAmount,
    isRecoveryMode,
    liquidationReserve,
    maxRbtcWeiBalance,
    rbtcPrice,
  ]);

  const ratio = useMemo(() => {
    if ([collateralAmount, debtAmount, rbtcPrice].some(v => !v)) {
      return 0;
    }
    return numeric(
      ((Number(collateralAmount) * Number(rbtcPrice)) / debtWithFees) * 100,
    );
  }, [collateralAmount, debtAmount, debtWithFees, rbtcPrice]);

  const liquidationPrice = useMemo(
    () =>
      numeric(
        MINIMUM_COLLATERAL_RATIO * (debtWithFees / Number(collateralAmount)),
      ),
    [debtWithFees, collateralAmount],
  );
  const liquidationPriceInRecoveryMode = useMemo(
    () =>
      numeric(
        CRITICAL_COLLATERAL_RATIO * (debtWithFees / Number(collateralAmount)),
      ),
    [collateralAmount, debtWithFees],
  );

  const errors = useMemo(() => {
    if (!fieldsTouched) {
      return [];
    }
    const errors = checkForSystemErrors(ratio, tcr);

    // Adjusting trove
    if (debtWithFees < MIN_DEBT_SIZE) {
      errors.push({
        level: ErrorLevel.Critical,
        message: t(translations.zeroPage.loc.errors.newTotalDebtTooLow, {
          value: formatValue(MIN_DEBT_SIZE, 4),
          currency: debtToken.toUpperCase(),
        }),
        weight: 5,
      });
    }

    return errors;
  }, [fieldsTouched, ratio, tcr, debtWithFees, debtToken]);

  const debtError = useMemo(() => {
    if (!fieldsTouched) {
      return undefined;
    }

    if (toWei(debtAmount).gt(toWei(maxDebtAmount))) {
      return t(translations.zeroPage.loc.errors.maxExceed);
    }

    return undefined;
  }, [debtAmount, fieldsTouched, maxDebtAmount]);

  const collateralError = useMemo(() => {
    if (!fieldsTouched) {
      return undefined;
    }

    if (toWei(collateralSize).lt(toWei(minCollateralAmount))) {
      return t(translations.zeroPage.loc.errors.collateralTooLow, {
        value: `${formatValue(minCollateralAmount, 4, true)} ${Bitcoin}`,
      });
    }

    if (toWei(collateralAmount).gt(maxRbtcWeiBalance)) {
      return t(translations.zeroPage.loc.errors.maxExceed);
    }

    return undefined;
  }, [
    collateralAmount,
    collateralSize,
    fieldsTouched,
    maxRbtcWeiBalance,
    minCollateralAmount,
  ]);

  const handleFormEdit = useCallback(() => setFieldsTouched(true), []);

  const handleFormSubmit = useCallback(
    () =>
      onSubmit({
        token: debtToken,
        borrow: debtAmount,
        depositCollateral: collateralAmount,
      } as CreditLineSubmitValue),
    [collateralAmount, debtAmount, debtToken, onSubmit],
  );

  return (
    <FormContent
      hasTrove={false}
      rbtcPrice={rbtcPrice}
      liquidationReserve={debtWithFees > 0 ? liquidationReserve : 0}
      borrowingRate={borrowingRate}
      originationFee={debtWithFees > 0 ? originationFee : 0}
      debtAmount={debtAmountInput}
      maxDebtAmount={maxDebtAmount}
      onDebtAmountChange={setDebtAmount}
      debtToken={debtToken}
      onDebtTokenChange={setDebtToken}
      collateralAmount={collateralAmountInput}
      maxCollateralAmount={maxCollateralAmount}
      onCollateralAmountChange={setCollateralAmount}
      initialRatio={0}
      currentRatio={ratio}
      initialLiquidationPrice={0}
      liquidationPrice={liquidationPrice}
      initialLiquidationPriceInRecoveryMode={0}
      liquidationPriceInRecoveryMode={liquidationPriceInRecoveryMode}
      totalDebt={debtWithFees}
      totalCollateral={collateralSize}
      onFormEdit={handleFormEdit}
      onFormSubmit={handleFormSubmit}
      debtError={debtError}
      collateralError={collateralError}
      errors={errors}
    />
  );
};
