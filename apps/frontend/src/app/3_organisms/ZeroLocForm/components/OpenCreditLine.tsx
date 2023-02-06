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
import { CreditLineSubmitValue } from '../types';
import { getOriginationFeeAmount, getTotalDebtAmount } from '../utils';
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
  const [collateralAmount, setCollateralAmount] = useState('0');
  const [debtAmount, setDebtAmount] = useState('0');
  const [debtToken, setDebtToken] = useState<SupportedTokens>(BORROW_ASSETS[0]);

  const debtSize = useMemo(() => Number(debtAmount || 0), [debtAmount]);
  const collateralSize = useMemo(
    () => Number(collateralAmount || 0),
    [collateralAmount],
  );

  const { value: maxCollateralWeiAmount } = useAssetBalance(
    SupportedTokens.rbtc,
  );

  const originationFee = useMemo(
    () => getOriginationFeeAmount(debtSize),
    [debtSize],
  );

  const debtWithFees = useMemo(
    () =>
      debtSize > 0
        ? getTotalDebtAmount(debtSize, borrowingRate, liquidationReserve)
        : 0,
    [debtSize, borrowingRate, liquidationReserve],
  );

  const rbtcGasPrice = useGasPrice();

  const maxRbtcWeiBalance = useMemo(
    () =>
      BigNumber.from(maxCollateralWeiAmount)
        .sub(composeGas(rbtcGasPrice || '0', GAS_LIMIT_BLOCK))
        .toString(),
    [maxCollateralWeiAmount, rbtcGasPrice],
  );

  const minCollateralAmount = useMemo(() => {
    return (
      (MIN_DEBT_SIZE / rbtcPrice) *
      (isRecoveryMode ? CRITICAL_COLLATERAL_RATIO : MINIMUM_COLLATERAL_RATIO)
    );
  }, [isRecoveryMode, rbtcPrice]);

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
    return (
      ((Number(collateralAmount) * Number(rbtcPrice)) / debtWithFees) * 100 || 0
    );
  }, [collateralAmount, debtAmount, debtWithFees, rbtcPrice]);

  const { t } = useTranslation();

  const liquidationPrice = useMemo(
    () => MINIMUM_COLLATERAL_RATIO * (debtSize / Number(collateralAmount)),
    [debtSize, collateralAmount],
  );
  const liquidationPriceInRecoveryMode = useMemo(
    () => CRITICAL_COLLATERAL_RATIO * (debtSize / Number(collateralAmount)),
    [collateralAmount, debtSize],
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

    // Adjusting trove
    if (debtWithFees < MIN_DEBT_SIZE) {
      list.push({
        level: ErrorLevel.Critical,
        message: 'The new debt amount has to be at least 200 ZUSD',
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
  }, [fieldsTouched, ratio, tcr, debtWithFees, t]);

  const debtError = useMemo(() => {
    if (!fieldsTouched) {
      return undefined;
    }

    if (debtSize < MIN_DEBT_SIZE - liquidationReserve) {
      return t(translations.zeroPage.loc.errors.debtTooLow, {
        value: `${formatValue(
          MIN_DEBT_SIZE - liquidationReserve,
        )} ${debtToken.toUpperCase()}`,
      });
    }

    if (toWei(debtAmount).gt(toWei(maxDebtAmount))) {
      const diff = Number(fromWei(toWei(debtAmount).sub(toWei(maxDebtAmount))));
      return t(translations.zeroPage.loc.errors.creditBalanceTooLow, {
        value: formatValue(diff, 4),
        currency: debtToken.toUpperCase(),
      });
    }

    return undefined;
  }, [
    debtAmount,
    debtSize,
    debtToken,
    fieldsTouched,
    liquidationReserve,
    maxDebtAmount,
    t,
  ]);

  const collateralError = useMemo(() => {
    if (!fieldsTouched) {
      return undefined;
    }

    if (toWei(collateralSize).lt(toWei(minCollateralAmount))) {
      return t(translations.zeroPage.loc.errors.collateralTooLow, {
        value: `${formatValue(
          minCollateralAmount,
          4,
        )} ${SupportedTokens.rbtc.toUpperCase()}`,
      });
    }

    if (toWei(collateralAmount).gt(maxCollateralWeiAmount)) {
      const diff = Number(
        fromWei(toWei(collateralAmount || 0).sub(maxCollateralWeiAmount)),
      );
      return t(translations.zeroPage.loc.errors.balanceTooLow, {
        value: `${formatValue(diff, 4)} ${SupportedTokens.rbtc.toUpperCase()}`,
      });
    }

    return undefined;
  }, [
    collateralAmount,
    collateralSize,
    fieldsTouched,
    maxCollateralWeiAmount,
    minCollateralAmount,
    t,
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
      originationFee={originationFee}
      debtAmount={debtAmount}
      maxDebtAmount={maxDebtAmount}
      onDebtAmountChange={setDebtAmount}
      debtToken={debtToken}
      onDebtTokenChange={setDebtToken}
      collateralAmount={collateralAmount}
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
