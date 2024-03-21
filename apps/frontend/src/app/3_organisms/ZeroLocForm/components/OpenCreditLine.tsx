import React, { useCallback, useMemo, useState, FC, useEffect } from 'react';

import { t } from 'i18next';

import { SupportedTokens } from '@sovryn/contracts';
import { ErrorLevel } from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { BORROW_ASSETS } from '../../../5_pages/ZeroPage/constants';
import { useLiquityBaseParams } from '../../../5_pages/ZeroPage/hooks/useLiquityBaseParams';
import {
  BITCOIN,
  BTC_RENDER_PRECISION,
} from '../../../../constants/currencies';
import { getTokenDisplayName } from '../../../../constants/tokens';
import { useAmountInput } from '../../../../hooks/useAmountInput';
import { useMaxAssetBalance } from '../../../../hooks/useMaxAssetBalance';
import { translations } from '../../../../locales/i18n';
import { COMMON_SYMBOLS } from '../../../../utils/asset';
import { formatValue, decimalic } from '../../../../utils/math';
import {
  CRITICAL_COLLATERAL_RATIO,
  MINIMUM_COLLATERAL_RATIO,
  MIN_DEBT_SIZE,
  SMALL_AMOUNT,
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
  rbtcPrice: Decimal;
  borrowingRate: Decimal;
};

export const OpenCreditLine: FC<OpenCreditLineProps> = ({
  onSubmit,
  rbtcPrice,
  borrowingRate,
}) => {
  const { maxBorrowingFeeRate } = useLiquityBaseParams();
  const {
    tcr,
    liquidationReserve,
    isRecoveryMode,
    isLoading: zeroDataLoading,
  } = useZeroData(rbtcPrice);

  const [fieldsTouched, setFieldsTouched] = useState(false);
  const [collateralAmountInput, setCollateralAmount, collateralAmount] =
    useAmountInput('');
  const [debtAmountInput, setDebtAmount, debtAmount] = useAmountInput('');
  const [debtToken, setDebtToken] = useState<SupportedTokens>(BORROW_ASSETS[0]);
  const [maxOriginationFeeRate, setMaxOriginationFeeRate] = useState('0');

  const debtSize = useMemo(() => decimalic(debtAmount || 0), [debtAmount]);
  const collateralSize = useMemo(
    () => decimalic(collateralAmount || 0),
    [collateralAmount],
  );

  const { weiBalance: maxRbtcWeiBalance, loading: maxRbtcBalanceLoading } =
    useMaxAssetBalance(COMMON_SYMBOLS.BTC);

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

  const requiredRatio = useMemo(
    () =>
      isRecoveryMode ? CRITICAL_COLLATERAL_RATIO : MINIMUM_COLLATERAL_RATIO,
    [isRecoveryMode],
  );

  const minCollateralAmount = useMemo(
    () =>
      Decimal.max(MIN_DEBT_SIZE, debtWithFees)
        .div(rbtcPrice)
        .mul(requiredRatio),
    [debtWithFees, rbtcPrice, requiredRatio],
  );

  const maxCollateralAmount = useMemo(
    () =>
      maxRbtcBalanceLoading
        ? Decimal.ZERO
        : Decimal.fromBigNumberString(maxRbtcWeiBalance),
    [maxRbtcWeiBalance, maxRbtcBalanceLoading],
  );

  const maxDebtAmount = useMemo(() => {
    if (zeroDataLoading) {
      return Decimal.ZERO;
    }
    let collateral = maxCollateralAmount.mul(rbtcPrice);
    if (collateralSize.gt(0)) {
      collateral = collateralSize.mul(rbtcPrice);
    }
    const reserve = liquidationReserve.mul(requiredRatio).mul(-1);

    return Decimal.max(
      reserve
        .add(collateral)
        .div(requiredRatio)
        .div(borrowingRate.add(1))
        .sub(SMALL_AMOUNT),
      0,
    );
  }, [
    borrowingRate,
    collateralSize,
    liquidationReserve,
    maxCollateralAmount,
    rbtcPrice,
    requiredRatio,
    zeroDataLoading,
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
          currency: getTokenDisplayName(debtToken),
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
          BTC_RENDER_PRECISION,
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
        maxOriginationFeeRate,
      } as CreditLineSubmitValue),
    [collateralAmount, debtAmount, debtToken, maxOriginationFeeRate, onSubmit],
  );

  useEffect(() => {
    if (maxBorrowingFeeRate) {
      setMaxOriginationFeeRate(maxBorrowingFeeRate.mul(100).toString());
    }
  }, [maxBorrowingFeeRate]);

  return (
    <FormContent
      hasTrove={false}
      rbtcPrice={rbtcPrice}
      liquidationReserve={
        debtWithFees.gt(0) ? liquidationReserve : Decimal.ZERO
      }
      borrowingRate={borrowingRate}
      originationFee={debtWithFees.gt(0) ? originationFee : Decimal.ZERO}
      maxOriginationFeeRate={maxOriginationFeeRate}
      onMaxOriginationFeeRateChange={setMaxOriginationFeeRate}
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
    />
  );
};
