import React, { useCallback, useMemo, useState, FC } from 'react';

import { t } from 'i18next';

import { SupportedTokens } from '@sovryn/contracts';
import { ErrorLevel } from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { BORROW_ASSETS } from '../../../5_pages/ZeroPage/constants';
import { BITCOIN } from '../../../../constants/currencies';
import { useAmountInput } from '../../../../hooks/useAmountInput';
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
  checkForSystemErrors,
  getOriginationFeeAmount,
  getTotalDebtAmount,
} from '../utils';
import { FormContent } from './FormContent';

export type OpenCreditLineProps = {
  onSubmit: (value: CreditLineSubmitValue) => void;
  rbtcPrice: Decimal;
  borrowingRate: Decimal;
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

  const debtSize = useMemo(() => decimalic(debtAmount || 0), [debtAmount]);
  const collateralSize = useMemo(
    () => decimalic(collateralAmount || 0),
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
      debtSize.gt(0)
        ? getTotalDebtAmount(debtSize, borrowingRate, liquidationReserve)
        : Decimal.ZERO,
    [debtSize, borrowingRate, liquidationReserve],
  );

  const minCollateralAmount = useMemo(
    () =>
      Decimal.max(MIN_DEBT_SIZE, debtWithFees)
        .div(rbtcPrice)
        .mul(
          isRecoveryMode ? CRITICAL_COLLATERAL_RATIO : MINIMUM_COLLATERAL_RATIO,
        ),
    [debtWithFees, isRecoveryMode, rbtcPrice],
  );

  const maxCollateralAmount = useMemo(
    () => Decimal.fromBigNumberString(maxRbtcWeiBalance),
    [maxRbtcWeiBalance],
  );

  const maxDebtAmount = useMemo(() => {
    let amount = maxCollateralAmount
      .mul(rbtcPrice)
      .div(
        isRecoveryMode ? CRITICAL_COLLATERAL_RATIO : MINIMUM_COLLATERAL_RATIO,
      );

    if (collateralSize.gt(0)) {
      amount = collateralSize
        .mul(rbtcPrice)
        .div(
          isRecoveryMode ? CRITICAL_COLLATERAL_RATIO : MINIMUM_COLLATERAL_RATIO,
        );
    }

    const originationFee = getOriginationFeeAmount(amount, borrowingRate);

    return Decimal.max(amount.sub(originationFee).sub(liquidationReserve), 0);
  }, [
    borrowingRate,
    collateralSize,
    isRecoveryMode,
    liquidationReserve,
    maxCollateralAmount,
    rbtcPrice,
  ]);

  const ratio = useMemo(() => {
    if ([collateralSize, debtSize, rbtcPrice].some(v => v.isZero())) {
      return Decimal.ZERO;
    }
    return decimalic(collateralSize.mul(rbtcPrice).div(debtWithFees).mul(100));
  }, [collateralSize, debtSize, debtWithFees, rbtcPrice]);

  const liquidationPrice = useMemo(
    () =>
      decimalic(MINIMUM_COLLATERAL_RATIO.mul(debtWithFees).div(collateralSize)),
    [debtWithFees, collateralSize],
  );
  const liquidationPriceInRecoveryMode = useMemo(
    () =>
      decimalic(
        CRITICAL_COLLATERAL_RATIO.mul(debtWithFees).div(collateralSize),
      ),
    [collateralSize, debtWithFees],
  );

  const errors = useMemo(() => {
    if (!fieldsTouched) {
      return [];
    }
    const errors = checkForSystemErrors(ratio, tcr);

    // Adjusting trove
    if (debtWithFees.lt(MIN_DEBT_SIZE)) {
      errors.push({
        level: ErrorLevel.Critical,
        message: t(translations.zeroPage.loc.errors.newTotalDebtTooLow, {
          value: formatValue(MIN_DEBT_SIZE, 4),
          currency: debtToken.toUpperCase(),
        }),
        weight: 3,
      });
    }

    return errors;
  }, [fieldsTouched, ratio, tcr, debtWithFees, debtToken]);

  const debtError = useMemo(() => {
    if (!fieldsTouched) {
      return undefined;
    }

    if (debtSize.gt(maxDebtAmount)) {
      return t(translations.zeroPage.loc.errors.maxExceed);
    }

    return undefined;
  }, [debtSize, fieldsTouched, maxDebtAmount]);

  const collateralError = useMemo(() => {
    if (!fieldsTouched) {
      return undefined;
    }

    if (collateralSize.lt(minCollateralAmount)) {
      return t(translations.zeroPage.loc.errors.collateralTooLow, {
        value: `${formatValue(
          minCollateralAmount.toNumber(),
          4,
          true,
        )} ${BITCOIN}`,
      });
    }

    if (collateralSize.gt(maxCollateralAmount)) {
      return t(translations.zeroPage.loc.errors.maxExceed);
    }

    return undefined;
  }, [collateralSize, fieldsTouched, maxCollateralAmount, minCollateralAmount]);

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
      liquidationReserve={
        debtWithFees.gt(0) ? liquidationReserve : Decimal.ZERO
      }
      borrowingRate={borrowingRate}
      originationFee={debtWithFees.gt(0) ? originationFee : Decimal.ZERO}
      debtAmount={debtAmountInput}
      maxDebtAmount={maxDebtAmount}
      onDebtAmountChange={setDebtAmount}
      debtToken={debtToken}
      onDebtTokenChange={setDebtToken}
      collateralAmount={collateralAmountInput}
      maxCollateralAmount={maxCollateralAmount}
      onCollateralAmountChange={setCollateralAmount}
      initialRatio={Decimal.ZERO}
      currentRatio={ratio}
      initialLiquidationPrice={Decimal.ZERO}
      liquidationPrice={liquidationPrice}
      initialLiquidationPriceInRecoveryMode={Decimal.ZERO}
      liquidationPriceInRecoveryMode={liquidationPriceInRecoveryMode}
      totalDebt={debtWithFees}
      totalCollateral={collateralSize}
      onFormEdit={handleFormEdit}
      onFormSubmit={handleFormSubmit}
      debtError={debtError}
      collateralError={collateralError}
      errors={errors}
      debtType={AmountType.Add}
    />
  );
};
