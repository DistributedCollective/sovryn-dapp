import React, { useCallback, useMemo, useState, FC } from 'react';

import { BigNumber } from 'ethers';
import { useTranslation } from 'react-i18next';

import { SupportedTokens } from '@sovryn/contracts';

import { ErrorLevel } from '../../../1_atoms/ErrorBadge/ErrorBadge';
import { BORROW_ASSETS } from '../../../5_pages/ZeroPage/constants';
import { useAssetBalance } from '../../../../hooks/useAssetBalance';
import { useGasPrice } from '../../../../hooks/useGasPrice';
import { translations } from '../../../../locales/i18n';
import { Bitcoin, MAX_GAS_LIMIT } from '../../../../utils/constants';
import { composeGas } from '../../../../utils/helpers';
import { formatValue, fromWei, toWei } from '../../../../utils/math';
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
        .sub(composeGas(rbtcGasPrice || '0', MAX_GAS_LIMIT))
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
    const list = checkForSystemErrors(ratio, tcr);

    // Adjusting trove
    if (debtWithFees < MIN_DEBT_SIZE) {
      list.push({
        level: ErrorLevel.Critical,
        message: t(translations.zeroPage.loc.errors.newTotalDebtTooLow, {
          value: formatValue(MIN_DEBT_SIZE, 4),
          currency: debtToken.toUpperCase(),
        }),
        weight: 5,
      });
    }

    return list;
  }, [fieldsTouched, ratio, tcr, debtWithFees, t, debtToken]);

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
        value: `${formatValue(minCollateralAmount, 4)} ${Bitcoin}`,
      });
    }

    if (toWei(collateralAmount).gt(maxCollateralWeiAmount)) {
      const diff = Number(
        fromWei(toWei(collateralAmount || 0).sub(maxCollateralWeiAmount)),
      );
      return t(translations.zeroPage.loc.errors.balanceTooLow, {
        value: `${formatValue(diff, 4)} ${Bitcoin}`,
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
