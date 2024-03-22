import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { t } from 'i18next';

import {
  AmountInput,
  Button,
  ButtonStyle,
  ButtonType,
  DynamicValue,
  ErrorBadge,
  ErrorLevel,
  FormGroup,
  HealthBar,
  SimpleTable,
  SimpleTableRow,
} from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { AssetRenderer } from '../../../../2_molecules/AssetRenderer/AssetRenderer';
import { LabelWithTabsAndMaxButton } from '../../../../2_molecules/LabelWithTabsAndMaxButton/LabelWithTabsAndMaxButton';
import { convertLoanTokenToSupportedAssets } from '../../../../5_pages/BorrowPage/components/OpenLoansTable/OpenLoans.utils';
import { LoanItem } from '../../../../5_pages/BorrowPage/components/OpenLoansTable/OpenLoansTable.types';
import { useGetMinCollateralRatio } from '../../../../5_pages/BorrowPage/hooks/useGetMinCollateralRatio';
import {
  MINIMUM_COLLATERAL_RATIO_LENDING_POOLS,
  MINIMUM_COLLATERAL_RATIO_LENDING_POOLS_SOV,
} from '../../../../../constants/lending';
import { getTokenDisplayName } from '../../../../../constants/tokens';
import { useDecimalAmountInput } from '../../../../../hooks/useDecimalAmountInput';
import { useMaxAssetBalance } from '../../../../../hooks/useMaxAssetBalance';
import { useQueryRate } from '../../../../../hooks/useQueryRate';
import { translations } from '../../../../../locales/i18n';
import { COMMON_SYMBOLS } from '../../../../../utils/asset';
import { areValuesIdentical } from '../../../../../utils/helpers';
import { decimalic } from '../../../../../utils/math';
import {
  calculatePrepaidInterestFromDuration,
  getCollateralRatioThresholds,
  getOriginationFeeAmount,
  normalizeToken,
  renderValue,
} from '../../BorrowPage.utils';
import { useGetBorrowingAPR } from '../../hooks/useGetBorrowingAPR';
import { useGetMaintenanceStates } from '../../hooks/useGetMaintenanceStates';
import { useGetOriginationFee } from '../../hooks/useGetOriginationFee';
import { CurrentLoanData } from '../CurrentLoanData/CurrentLoanData';
import { useBorrow } from '../NewLoanForm/hooks/useBorrow';
import { useGetMaximumCollateralAmount } from '../NewLoanForm/hooks/useGetMaximumCollateralAmount';
import {
  COLLATERAL_TABS,
  DEBT_TABS,
  INTEREST_DURATION,
} from './AdjustLoanForm.constants';
import { CollateralTabAction, DebtTabAction } from './AdjustLoanForm.types';
import {
  calculateDebtRepaidPercentage,
  calculateRepayCollateralWithdrawn,
} from './AdjustLoanForm.utils';
import { useCloseWithDepositIsTinyPosition } from './hooks/useCloseWithDepositIsTinyPosition';
import { useDepositCollateral } from './hooks/useDepositCollateral';
import { useDrawdown } from './hooks/useDrawdown';
import { useGetInterestRefund } from './hooks/useGetInterestRefund';
import { useGetMaxCollateralWithdrawal } from './hooks/useGetMaxCollateralWithdrawal';
import { useGetMaxRepayAmount } from './hooks/useGetMaxRepayAmount';
import { useGetMaximumBorrowAmount } from './hooks/useGetMaximumBorrowAmount';
import { useRepayLoan } from './hooks/useRepayLoan';
import { useWithdrawCollateral } from './hooks/useWithdrawCollateral';

const pageTranslations = translations.fixedInterestPage.adjustLoanDialog;

type AdjustLoanFormProps = {
  loan: LoanItem;
};

export const AdjustLoanForm: FC<AdjustLoanFormProps> = ({ loan }) => {
  const [debtAmount, setDebtAmount, debtSize] = useDecimalAmountInput('');
  const [collateralAmount, setCollateralAmount, collateralSize] =
    useDecimalAmountInput('');

  const [debtTab, setDebtTab] = useState(DebtTabAction.Borrow);
  const [collateralTab, setCollateralTab] = useState(
    CollateralTabAction.AddCollateral,
  );

  const isCloseTab = useMemo(() => debtTab === DebtTabAction.Close, [debtTab]);
  const isBorrowTab = useMemo(
    () => debtTab === DebtTabAction.Borrow,
    [debtTab],
  );
  const isRepayTab = useMemo(() => debtTab === DebtTabAction.Repay, [debtTab]);

  const isAddCollateralTab = useMemo(
    () => collateralTab === CollateralTabAction.AddCollateral,
    [collateralTab],
  );
  const isCollateralWithdrawTab = useMemo(
    () => collateralTab === CollateralTabAction.WithdrawCollateral,
    [collateralTab],
  );
  const isCollateralWithdrawMode = useMemo(
    () => isCollateralWithdrawTab && debtTab === DebtTabAction.None,
    [debtTab, isCollateralWithdrawTab],
  );

  const [isTinyPosition, setIsTinyPosition] = useState(false);

  const originationFeeRate = useGetOriginationFee();

  const debtToken = useMemo(
    () => normalizeToken(loan.debtAsset.toLowerCase()),
    [loan.debtAsset],
  );
  const collateralToken = useMemo(
    () => normalizeToken(loan.collateralAsset.toLowerCase()),
    [loan.collateralAsset],
  );

  const {
    isBorrowLocked,
    isRepayLocked,
    isCloseLocked,
    isAddCollateralLocked,
    isWithdrawCollateralLocked,
  } = useGetMaintenanceStates(debtToken);

  const isDebtAmountDisabled = useMemo(
    () =>
      (isBorrowLocked && isBorrowTab) ||
      (isRepayLocked && isRepayTab) ||
      (isCloseLocked && isCloseTab),
    [
      isBorrowLocked,
      isBorrowTab,
      isCloseLocked,
      isCloseTab,
      isRepayLocked,
      isRepayTab,
    ],
  );

  const isCollateralAmountDisabled = useMemo(
    () =>
      (isAddCollateralLocked && isAddCollateralTab) ||
      (isWithdrawCollateralLocked && isCollateralWithdrawTab),
    [
      isAddCollateralLocked,
      isAddCollateralTab,
      isCollateralWithdrawTab,
      isWithdrawCollateralLocked,
    ],
  );

  const fullInterestRefundValue = useGetInterestRefund(loan.id);
  const totalDebtWithoutInterestRefund = useMemo(
    () => Decimal.from(loan.debt).sub(fullInterestRefundValue),
    [fullInterestRefundValue, loan.debt],
  );

  const interestRefundRepayValue = useMemo(() => {
    const debtRepayPercentage = calculateDebtRepaidPercentage(
      loan.debt.toString(),
      debtSize,
    );
    return fullInterestRefundValue.mul(debtRepayPercentage);
  }, [debtSize, fullInterestRefundValue, loan.debt]);

  const interestRefund = useMemo(
    () => (isCloseTab ? fullInterestRefundValue : interestRefundRepayValue),
    [fullInterestRefundValue, interestRefundRepayValue, isCloseTab],
  );

  const { maximumRepayAmount, maximumAvailableRepayAmount } =
    useGetMaxRepayAmount(debtToken, loan);

  const { borrowApr } = useGetBorrowingAPR(debtToken, debtSize);

  const { balance: debtTokenBalance } = useMaxAssetBalance(debtToken);

  const { maximumCollateralAmount, loading: isMaximumCollateralAmountLoading } =
    useGetMaximumCollateralAmount(collateralToken);

  const maximumCollateralWithdraw = useGetMaxCollateralWithdrawal(loan);

  const maxCollateralAmount = useMemo(() => {
    if (debtTab === DebtTabAction.Close) {
      return decimalic(loan.collateral);
    }

    if (isCollateralWithdrawMode) {
      return maximumCollateralWithdraw;
    }

    return isMaximumCollateralAmountLoading
      ? Decimal.ZERO
      : maximumCollateralAmount;
  }, [
    debtTab,
    isCollateralWithdrawMode,
    isMaximumCollateralAmountLoading,
    loan.collateral,
    maximumCollateralAmount,
    maximumCollateralWithdraw,
  ]);

  const originationFee = useMemo(
    () => getOriginationFeeAmount(collateralSize, originationFeeRate),
    [originationFeeRate, collateralSize],
  );

  const collateralWithdrawn = useMemo(
    () =>
      isRepayTab
        ? calculateRepayCollateralWithdrawn(
            maximumRepayAmount.toString(),
            debtSize.sub(interestRefund),
            loan.collateral.toString(),
          )
        : Decimal.ZERO,
    [debtSize, interestRefund, isRepayTab, loan.collateral, maximumRepayAmount],
  );

  const newCollateralAmount = useMemo(() => {
    if (
      collateralSize.isZero() &&
      debtSize.isZero() &&
      (isBorrowTab || isRepayTab)
    ) {
      return Decimal.ZERO;
    }

    if (isRepayTab) {
      if (areValuesIdentical(debtSize, maximumRepayAmount)) {
        return Decimal.ZERO;
      }
      return decimalic(loan.collateral.toString()).sub(collateralWithdrawn);
    }

    if (isCollateralWithdrawTab) {
      return decimalic(loan.collateral.toString()).sub(collateralSize);
    }

    return decimalic(loan.collateral.toString()).add(
      collateralSize.sub(originationFee),
    );
  }, [
    isBorrowTab,
    isRepayTab,
    isCollateralWithdrawTab,
    loan.collateral,
    collateralSize,
    originationFee,
    debtSize,
    maximumRepayAmount,
    collateralWithdrawn,
  ]);

  const prepaidInterest = calculatePrepaidInterestFromDuration(
    borrowApr,
    debtSize.toString(),
    INTEREST_DURATION,
  );

  const newTotalDebt = useMemo(() => {
    if (debtSize.isZero() && collateralSize.isZero()) {
      return Decimal.ZERO;
    }

    if (isRepayTab) {
      if (areValuesIdentical(debtSize, maximumRepayAmount)) {
        return Decimal.ZERO;
      }
      return decimalic(loan.debt.toString()).sub(debtSize);
    }

    return decimalic(loan.debt.toString())
      .add(debtSize)
      .add(prepaidInterest.toString());
  }, [
    debtSize,
    collateralSize,
    isRepayTab,
    loan.debt,
    prepaidInterest,
    maximumRepayAmount,
  ]);

  const maximumBorrowAmount = useGetMaximumBorrowAmount(loan, collateralSize);

  const maxDebtAmount = useMemo(
    () => (isBorrowTab ? maximumBorrowAmount : maximumAvailableRepayAmount),
    [isBorrowTab, maximumAvailableRepayAmount, maximumBorrowAmount],
  );

  const isValidDebtAmount = useMemo(() => {
    if (isCloseTab) {
      return true;
    }

    return debtSize.lte(maxDebtAmount);
  }, [debtSize, isCloseTab, maxDebtAmount]);

  const isValidCollateralAmount = useMemo(
    () => collateralSize.lte(maxCollateralAmount),
    [collateralSize, maxCollateralAmount],
  );

  const minimumCollateralRatio = useMemo(
    () =>
      collateralToken === COMMON_SYMBOLS.SOV
        ? MINIMUM_COLLATERAL_RATIO_LENDING_POOLS_SOV
        : MINIMUM_COLLATERAL_RATIO_LENDING_POOLS,
    [collateralToken],
  );

  const [collateralToLoanRate] = useQueryRate(collateralToken, debtToken);

  const collateralRatio = useMemo(() => {
    if (debtSize.isZero() && collateralSize.isZero()) {
      return Decimal.ZERO;
    }

    const debt = isCollateralWithdrawMode
      ? Decimal.from(loan.debt)
      : newTotalDebt;

    return newCollateralAmount.mul(collateralToLoanRate).div(debt).mul(100);
  }, [
    debtSize,
    collateralSize,
    isCollateralWithdrawMode,
    loan.debt,
    newTotalDebt,
    newCollateralAmount,
    collateralToLoanRate,
  ]);

  const maintenanceMargin = useGetMinCollateralRatio(debtToken);

  const isValidCollateralRatio = useMemo(() => {
    if (collateralSize.isZero() && debtSize.isZero()) {
      return true;
    }
    return collateralRatio.gte(minimumCollateralRatio.mul(100));
  }, [collateralRatio, collateralSize, debtSize, minimumCollateralRatio]);

  const collateralRatioError = useMemo(() => {
    if (collateralRatio.lt(minimumCollateralRatio.mul(100))) {
      return t(pageTranslations.labels.collateralRatioError, {
        min: minimumCollateralRatio.mul(100),
      });
    }
    return '';
  }, [collateralRatio, minimumCollateralRatio]);

  const liquidationPrice = useMemo(() => {
    if (collateralSize.isZero() && debtSize.isZero()) {
      return Decimal.ZERO;
    }

    const debt = isCollateralWithdrawMode
      ? Decimal.from(loan.debt)
      : newTotalDebt;

    return maintenanceMargin.mul(debt).div(newCollateralAmount);
  }, [
    collateralSize,
    debtSize,
    isCollateralWithdrawMode,
    loan.debt,
    maintenanceMargin,
    newCollateralAmount,
    newTotalDebt,
  ]);

  const [collateralAssetPrice] = useQueryRate(collateralToken, debtToken);

  const setCloseDebtTabValues = useCallback(() => {
    setDebtAmount(totalDebtWithoutInterestRefund.toString());
    setCollateralAmount(loan.collateral.toString());
  }, [
    loan.collateral,
    setCollateralAmount,
    setDebtAmount,
    totalDebtWithoutInterestRefund,
  ]);

  const resetCloseDebtTabValues = useCallback(() => {
    setDebtAmount('');
    setCollateralAmount('');
  }, [setCollateralAmount, setDebtAmount]);

  const handleRepay = useRepayLoan();
  const handleBorrow = useBorrow();
  const handleWithdrawCollateral = useWithdrawCollateral();
  const handleDepositCollateral = useDepositCollateral();

  const handleFormSubmit = useCallback(() => {
    if (isCloseTab) {
      handleRepay(
        loan.debt.toString(),
        loan.id,
        convertLoanTokenToSupportedAssets(loan.debtAsset),
      );
      return;
    }

    if (isRepayTab) {
      handleRepay(
        debtSize.toString(),
        loan.id,
        convertLoanTokenToSupportedAssets(loan.debtAsset),
        true,
      );
      return;
    }

    if (isBorrowTab) {
      if (debtSize.isZero()) {
        handleDepositCollateral(collateralAmount, collateralToken, loan.id);
      } else {
        handleBorrow(
          debtToken,
          debtAmount,
          loan.rolloverDate,
          collateralSize.toString(),
          collateralToken,
          loan.id,
        );
      }
      return;
    }

    if (isAddCollateralTab) {
      handleDepositCollateral(collateralAmount, collateralToken, loan.id);
      return;
    }

    if (isCollateralWithdrawMode) {
      handleWithdrawCollateral(collateralAmount, loan.id);
    }
  }, [
    collateralAmount,
    collateralSize,
    collateralToken,
    debtAmount,
    debtSize,
    debtToken,
    handleBorrow,
    handleDepositCollateral,
    handleRepay,
    handleWithdrawCollateral,
    isAddCollateralTab,
    isBorrowTab,
    isCloseTab,
    isCollateralWithdrawMode,
    isRepayTab,
    loan.debt,
    loan.debtAsset,
    loan.id,
    loan.rolloverDate,
  ]);

  const onDebtTabChange = useCallback(
    (value: DebtTabAction) => {
      switch (value) {
        case DebtTabAction.Borrow:
          setCollateralTab(CollateralTabAction.AddCollateral);
          setDebtTab(value);
          resetCloseDebtTabValues();
          return;
        case DebtTabAction.Repay:
          if (isCloseTab) {
            setIsTinyPosition(false);
            resetCloseDebtTabValues();
          }
          setCollateralTab(CollateralTabAction.WithdrawCollateral);
          setDebtTab(value);
          return;
        case DebtTabAction.Close:
          setCollateralTab(CollateralTabAction.WithdrawCollateral);
          setDebtTab(value);
          setCloseDebtTabValues();
          return;
        default:
          return;
      }
    },
    [isCloseTab, resetCloseDebtTabValues, setCloseDebtTabValues],
  );

  const onCollateralTabChange = useCallback(
    (value: CollateralTabAction) => {
      switch (value) {
        case CollateralTabAction.AddCollateral:
          if (!isBorrowTab) {
            setDebtTab(DebtTabAction.Borrow);
          }

          setDebtAmount(loan.debt.toString());

          setCollateralTab(value);
          resetCloseDebtTabValues();
          return;
        case CollateralTabAction.WithdrawCollateral:
          if (isBorrowTab) {
            setDebtTab(DebtTabAction.None);
            setDebtAmount(loan.debt.toString());
          }
          setCollateralTab(value);
          return;
        default:
          return;
      }
    },
    [isBorrowTab, loan.debt, resetCloseDebtTabValues, setDebtAmount],
  );

  const collateralAmountValue = useMemo(() => {
    if (isRepayTab) {
      if (areValuesIdentical(debtSize, maximumRepayAmount)) {
        return loan.collateral.toString();
      }
      return collateralWithdrawn.toString();
    }
    return collateralAmount;
  }, [
    collateralAmount,
    collateralWithdrawn,
    debtSize,
    isRepayTab,
    loan.collateral,
    maximumRepayAmount,
  ]);

  const isLeavingTinyPosition = useCloseWithDepositIsTinyPosition(
    loan.id,
    debtAmount,
  );

  useEffect(() => {
    if (debtAmount !== '' && debtAmount !== '0') {
      setIsTinyPosition(isLeavingTinyPosition);
    }
  }, [debtAmount, isLeavingTinyPosition]);

  useEffect(() => {
    if (
      isRepayTab &&
      (areValuesIdentical(debtSize, maximumRepayAmount) || isTinyPosition)
    ) {
      setDebtTab(DebtTabAction.Close);
      setCloseDebtTabValues();
    }
  }, [
    debtAmount,
    debtSize,
    isLeavingTinyPosition,
    isRepayTab,
    isTinyPosition,
    maximumRepayAmount,
    resetCloseDebtTabValues,
    setCloseDebtTabValues,
  ]);

  const isValidCloseAmount = useMemo(() => {
    if (!isCloseTab) {
      return true;
    }
    return Decimal.from(loan.debt).sub(interestRefund).lte(debtTokenBalance);
  }, [debtTokenBalance, interestRefund, isCloseTab, loan.debt]);

  const submitButtonDisabled = useMemo(() => {
    if (isRepayTab) {
      return (
        debtSize.isZero() ||
        debtSize.gt(maxDebtAmount) ||
        isDebtAmountDisabled ||
        isCollateralAmountDisabled
      );
    }

    if (isBorrowTab) {
      return (
        (debtSize.isZero() && collateralSize.isZero()) ||
        collateralRatioError !== '' ||
        !isValidCollateralAmount ||
        debtSize.gt(maxDebtAmount) ||
        isDebtAmountDisabled ||
        isCollateralAmountDisabled
      );
    }

    if (isCollateralWithdrawMode) {
      return (
        collateralSize.isZero() ||
        collateralRatioError !== '' ||
        !isValidCollateralAmount ||
        isDebtAmountDisabled ||
        isCollateralAmountDisabled
      );
    }

    if (isCloseTab) {
      return (
        !isValidCloseAmount ||
        isDebtAmountDisabled ||
        isCollateralAmountDisabled
      );
    }
  }, [
    isRepayTab,
    isBorrowTab,
    isCollateralWithdrawMode,
    isCloseTab,
    debtSize,
    maxDebtAmount,
    collateralSize,
    collateralRatioError,
    isValidCollateralAmount,
    isDebtAmountDisabled,
    isCollateralAmountDisabled,
    isValidCloseAmount,
  ]);

  const errorBadge = useMemo(() => {
    let message: string = '';
    if (!isValidCloseAmount) {
      message = t(
        translations.fixedInterestPage.adjustLoanDialog
          .closeTabInsufficientLoanTokenBalance,
        {
          amount: Decimal.from(loan.debt)
            .sub(interestRefund)
            .sub(debtTokenBalance)
            .toString(),
          token: debtToken.toUpperCase(),
        },
      );
    }

    if (!message || message === '') {
      return null;
    }

    return (
      <ErrorBadge
        level={ErrorLevel.Critical}
        message={message}
        dataAttribute="adjust-loan-collateral-error"
      />
    );
  }, [
    debtToken,
    debtTokenBalance,
    interestRefund,
    isValidCloseAmount,
    loan.debt,
  ]);

  const collateralRatioThresholds = useMemo(
    () => getCollateralRatioThresholds(collateralToken),
    [collateralToken],
  );

  const collateralAmountErrorLabel = useMemo(
    () =>
      !isValidCollateralAmount
        ? t(translations.fixedInterestPage.invalidAmountError)
        : undefined,
    [isValidCollateralAmount],
  );

  const debtAmountErrorLabel = useMemo(
    () =>
      !isValidDebtAmount
        ? t(translations.fixedInterestPage.invalidAmountError)
        : undefined,
    [isValidDebtAmount],
  );

  const { maxBorrow } = useDrawdown(loan, collateralSize, isAddCollateralTab);

  return (
    <>
      <CurrentLoanData
        debt={loan.debt}
        debtToken={debtToken}
        collateral={loan.collateral}
        collateralToken={collateralToken}
        collateralRatio={loan.collateralRatio}
      />

      <FormGroup
        label={
          <LabelWithTabsAndMaxButton
            token={loan.debtAsset}
            maxAmount={maxDebtAmount}
            tabs={DEBT_TABS}
            onTabChange={onDebtTabChange}
            onMaxAmountClicked={() => setDebtAmount(maxDebtAmount.toString())}
            isDisabled={isCloseTab || isCollateralWithdrawMode}
            index={debtTab}
            setIndex={setDebtTab}
            dataAttributePrefix="adjust-loan"
          />
        }
        labelElement="div"
        errorLabel={debtAmountErrorLabel}
        className="w-full"
        dataAttribute="adjust-loan-debt-amount"
      >
        <div className="w-full flex flex-row justify-between items-center gap-3">
          <AmountInput
            value={debtAmount}
            onChangeText={setDebtAmount}
            maxAmount={maxDebtAmount.toNumber()}
            label={t(translations.common.amount)}
            className="w-full flex-grow-0 flex-shrink"
            invalid={!isValidDebtAmount}
            placeholder="0"
            disabled={
              isCloseTab || isCollateralWithdrawMode || isDebtAmountDisabled
            }
          />
          <AssetRenderer
            dataAttribute="adjust-loan-debt-asset"
            showAssetLogo
            asset={debtToken}
            className="min-w-24 h-10 rounded bg-gray-60 items-center px-4 mr-0"
          />
        </div>
        {isDebtAmountDisabled && (
          <ErrorBadge
            level={ErrorLevel.Warning}
            message={t(translations.maintenanceMode.featureDisabled)}
          />
        )}
      </FormGroup>
      <FormGroup
        label={
          <LabelWithTabsAndMaxButton
            token={collateralToken}
            maxAmount={maxCollateralAmount}
            tabs={COLLATERAL_TABS}
            onTabChange={onCollateralTabChange}
            onMaxAmountClicked={() =>
              setCollateralAmount(maxCollateralAmount.toString())
            }
            index={collateralTab}
            setIndex={setCollateralTab}
            isDisabled={isCloseTab || isRepayTab}
            dataAttributePrefix="adjust-loan"
          />
        }
        labelElement="div"
        className="max-w-none mt-8"
        errorLabel={collateralAmountErrorLabel}
        dataAttribute="adjust-loan-collateral-amount"
      >
        <div className="w-full flex flex-row justify-between items-center gap-3">
          <AmountInput
            value={collateralAmountValue}
            onChangeText={setCollateralAmount}
            maxAmount={maxCollateralAmount.toNumber()}
            label={t(translations.common.amount)}
            className="max-w-none"
            placeholder="0"
            invalid={!isValidCollateralAmount}
            disabled={isCloseTab || isRepayTab || isCollateralAmountDisabled}
          />
          <AssetRenderer
            dataAttribute="adjust-loan-collateral-asset"
            showAssetLogo
            asset={collateralToken}
            className="min-w-24 h-10 rounded bg-gray-60 items-center px-4 mr-0"
          />
        </div>
        {isCollateralAmountDisabled && (
          <ErrorBadge
            level={ErrorLevel.Warning}
            message={t(translations.maintenanceMode.featureDisabled)}
          />
        )}
      </FormGroup>

      <div className="mt-6">
        <SimpleTable>
          {!isCollateralWithdrawTab && (
            <SimpleTableRow
              label={t(pageTranslations.labels.borrowApr)}
              value={
                <DynamicValue
                  initialValue="0"
                  value={Decimal.fromBigNumberString(
                    borrowApr.toString(),
                  ).toString()}
                  renderer={value => renderValue(value, '%', 0)}
                />
              }
            />
          )}
          {!isCollateralWithdrawTab && (
            <SimpleTableRow
              label={t(pageTranslations.labels.originationFee)}
              value={
                <DynamicValue
                  initialValue="0"
                  value={originationFee.toString()}
                  renderer={value => renderValue(value, collateralToken)}
                />
              }
            />
          )}
          {(isCloseTab || isRepayTab) && (
            <SimpleTableRow
              label={t(pageTranslations.labels.interestRefund)}
              value={
                <AmountRenderer
                  value={interestRefund}
                  suffix={getTokenDisplayName(debtToken)}
                />
              }
            />
          )}
          {(isBorrowTab || isRepayTab || isCollateralWithdrawMode) && (
            <SimpleTableRow
              label={t(pageTranslations.labels.newCollateralBalance)}
              value={
                <DynamicValue
                  initialValue="0"
                  value={newCollateralAmount.toString()}
                  renderer={() =>
                    renderValue(newCollateralAmount.toString(), collateralToken)
                  }
                />
              }
            />
          )}
          {(isBorrowTab || isRepayTab) && (
            <SimpleTableRow
              label={t(pageTranslations.labels.newTotalDebt)}
              value={
                <DynamicValue
                  initialValue="0"
                  value={newTotalDebt.toString()}
                  renderer={() =>
                    renderValue(newTotalDebt.toString(), debtToken)
                  }
                />
              }
            />
          )}
        </SimpleTable>
      </div>

      {(isBorrowTab || isCollateralWithdrawMode) && (
        <>
          <div className="flex flex-row justify-between items-center mt-6 mb-3">
            <div className="flex flex-row justify-start items-center gap-2">
              <span>
                {t(translations.adjustCreditLine.labels.collateralRatio)}
              </span>
            </div>
            <div className="text-primary-10">
              <DynamicValue
                initialValue="0"
                value={collateralRatio.toString()}
                renderer={value => renderValue(value, '%', 0)}
              />
            </div>
          </div>

          <HealthBar
            start={collateralRatioThresholds.START}
            middleStart={collateralRatioThresholds.MIDDLE_START}
            middleEnd={collateralRatioThresholds.MIDDLE_END}
            end={collateralRatioThresholds.END}
            value={collateralRatio.toNumber()}
          />
          {!isValidCollateralRatio && (
            <ErrorBadge
              level={ErrorLevel.Critical}
              message={collateralRatioError}
              dataAttribute="adjust-loan-collateral-ratio-error"
            />
          )}
        </>
      )}

      {(isBorrowTab || isCollateralWithdrawMode) && (
        <div className="mt-6">
          <SimpleTable>
            <SimpleTableRow
              label={t(pageTranslations.labels.liquidationPrice)}
              value={
                <DynamicValue
                  initialValue="0"
                  value={liquidationPrice.toString()}
                  renderer={value => renderValue(value, debtToken)}
                />
              }
            />
            <SimpleTableRow
              label={t(pageTranslations.labels.collateralPrice, {
                token: getTokenDisplayName(collateralToken),
              })}
              value={
                <DynamicValue
                  initialValue="0"
                  value={collateralAssetPrice.toString()}
                  renderer={value => renderValue(value, debtToken)}
                />
              }
            />
          </SimpleTable>
        </div>
      )}

      {errorBadge}

      <div className="mt-8 flex flex-row items-center justify-between gap-8">
        <Button
          type={ButtonType.submit}
          style={ButtonStyle.primary}
          text={t(translations.common.buttons.confirm)}
          className="w-full"
          onClick={handleFormSubmit}
          dataAttribute="adjust-loan-confirm-button"
          disabled={
            submitButtonDisabled || (isBorrowTab && debtSize.gt(maxBorrow))
          }
        />
      </div>
    </>
  );
};
