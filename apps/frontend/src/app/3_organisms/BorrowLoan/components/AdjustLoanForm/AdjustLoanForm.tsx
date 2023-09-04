import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { t } from 'i18next';

import { SupportedTokens } from '@sovryn/contracts';
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
import { convertLoanTokenToSupportedAssets } from '../../../../5_pages/BorrowPage/components/OpenLoansTable/OpenLoans.utils';
import { LoanItem } from '../../../../5_pages/BorrowPage/components/OpenLoansTable/OpenLoansTable.types';
import { MINIMUM_COLLATERAL_RATIO_BORROWING_MAINTENANCE } from '../../../../../constants/lending';
import { getTokenDisplayName } from '../../../../../constants/tokens';
import { useMaxAssetBalance } from '../../../../../hooks/useMaxAssetBalance';
import { useGetRBTCPrice } from '../../../../../hooks/zero/useGetRBTCPrice';
import { translations } from '../../../../../locales/i18n';
import { decimalic } from '../../../../../utils/math';
import { useBorrow } from '../../../BorrowLoanForm/components/NewLoanForm/hooks/useBorrow';
import { useGetMaximumCollateralAmount } from '../../../BorrowLoanForm/components/NewLoanForm/hooks/useGetMaximumCollateralAmount';
import { getOriginationFeeAmount } from '../../../ZeroLocForm/utils';
import {
  COLLATERAL_TABS,
  DEBT_TABS,
  INTEREST_DURATION,
} from './AdjustLoanForm.constants';
import { CollateralTabAction, DebtTabAction } from './AdjustLoanForm.types';
import {
  areValuesIdentical,
  calculateDebtRepaidPercentage,
  calculatePrepaidInterest,
  calculateRepayCollateralWithdrawn,
  getCollateralRatioThresholds,
  normalizeToken,
  renderValue,
} from './AdjustLoanForm.utils';
import { CurrentLoanData } from './components/CurrentLoanData';
import { Label } from './components/Label';
import { useDepositCollateral } from './hooks/useDepositCollateral';
import { useGetBorrowingAPR } from './hooks/useGetBorrowingAPR';
import { useGetCollateralAssetPrice } from './hooks/useGetCollateralAssetPrice';
import { useGetInterestRefund } from './hooks/useGetInterestRefund';
import { useGetMaxCollateralWithdrawal } from './hooks/useGetMaxCollateralWithdrawal';
import { useGetMaxRepayAmount } from './hooks/useGetMaxRepayAmount';
import { useGetMaximumBorrowAmount } from './hooks/useGetMaximumBorrowAmount';
import { useGetOriginationFee } from './hooks/useGetOriginationFee';
import { useRepayLoan } from './hooks/useRepayLoan';
import { useWithdrawCollateral } from './hooks/useWithdrawCollateral';

const pageTranslations = translations.fixedInterestPage.adjustLoanDialog;

type AdjustLoanFormProps = {
  loan: LoanItem;
  onSuccess: () => void;
};

export const AdjustLoanForm: FC<AdjustLoanFormProps> = ({ loan }) => {
  const [debtAmount, setDebtAmount] = useState('');
  const [collateralAmount, setCollateralAmount] = useState('');
  const debtSize = useMemo(() => decimalic(debtAmount), [debtAmount]);
  const collateralSize = useMemo(
    () => decimalic(collateralAmount),
    [collateralAmount],
  );
  const [debtTab, setDebtTab] = useState(DebtTabAction.Borrow);
  const [collateralTab, setCollateralTab] = useState(
    CollateralTabAction.AddCollateral,
  );

  const originationFeeRate = useGetOriginationFee();
  const [collateralAssetPrice, setCollateralAssetPrice] = useState('0');

  const debtToken = useMemo(
    () => normalizeToken(loan.debtAsset.toLowerCase()),
    [loan.debtAsset],
  );
  const collateralToken = useMemo(
    () => normalizeToken(loan.collateralAsset.toLowerCase()),
    [loan.collateralAsset],
  );
  const { price: rbtcPrice } = useGetRBTCPrice();

  const isCloseTab = useMemo(() => debtTab === DebtTabAction.Close, [debtTab]);

  const fullInterestRefundValue = useGetInterestRefund(loan.id);
  const totalDebtWithoutInterestRefund = useMemo(
    () => Decimal.from(loan.debt).sub(fullInterestRefundValue),
    [fullInterestRefundValue, loan.debt],
  );
  const interestRefundRepayValue = useMemo(() => {
    const debtRepayPercentage = calculateDebtRepaidPercentage(
      totalDebtWithoutInterestRefund.toString(),
      debtSize,
    );
    return fullInterestRefundValue.mul(debtRepayPercentage);
  }, [debtSize, fullInterestRefundValue, totalDebtWithoutInterestRefund]);

  const interestRefund = useMemo(
    () => (isCloseTab ? fullInterestRefundValue : interestRefundRepayValue),
    [fullInterestRefundValue, interestRefundRepayValue, isCloseTab],
  );

  const { maximumRepayAmount, maximumAvailableRepayAmount } =
    useGetMaxRepayAmount(debtToken, loan);

  const { borrowApr } = useGetBorrowingAPR(debtToken, debtSize);

  const isCollateralWithdrawTab = useMemo(
    () => collateralTab === CollateralTabAction.WithdrawCollateral,
    [collateralTab],
  );

  const isCollateralWithdrawMode = useMemo(
    () => isCollateralWithdrawTab && debtTab === DebtTabAction.None,
    [debtTab, isCollateralWithdrawTab],
  );

  const isBorrowTab = useMemo(
    () => debtTab === DebtTabAction.Borrow,
    [debtTab],
  );

  const isRepayTab = useMemo(() => debtTab === DebtTabAction.Repay, [debtTab]);

  const { balance: debtTokenBalance } = useMaxAssetBalance(
    debtToken as SupportedTokens,
  );
  const { borrowPriceUsd, collateralPriceUsd } = useGetCollateralAssetPrice(
    debtToken,
    collateralToken,
  );

  const { maximumCollateralAmount, loading: isMaximumCollateralAmountLoading } =
    useGetMaximumCollateralAmount(collateralToken);

  const maximumCollateralWithdraw = useGetMaxCollateralWithdrawal(loan);

  const maxCollateralAmount = useMemo(() => {
    if (isCollateralWithdrawMode) {
      return maximumCollateralWithdraw;
    }

    return isMaximumCollateralAmountLoading
      ? Decimal.ZERO
      : maximumCollateralAmount;
  }, [
    isCollateralWithdrawMode,
    isMaximumCollateralAmountLoading,
    maximumCollateralAmount,
    maximumCollateralWithdraw,
  ]);

  const originationFee = useMemo(
    () => getOriginationFeeAmount(collateralSize, originationFeeRate.div(100)),
    [originationFeeRate, collateralSize],
  );

  const collateralWithdrawn = useMemo(
    () =>
      isRepayTab
        ? calculateRepayCollateralWithdrawn(
            maximumRepayAmount.toString(),
            debtSize,
            loan.collateral.toString(),
          )
        : Decimal.ZERO,
    [debtSize, isRepayTab, loan.collateral, maximumRepayAmount],
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

  const prepaidInterest = calculatePrepaidInterest(
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
      return decimalic(loan.debt.toString()).sub(debtSize).sub(interestRefund);
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
    interestRefund,
  ]);

  const maximumBorrowAmount = useGetMaximumBorrowAmount(loan, collateralSize);

  const maxDebtAmount = useMemo(
    () => (isBorrowTab ? maximumBorrowAmount : maximumAvailableRepayAmount),
    [isBorrowTab, maximumAvailableRepayAmount, maximumBorrowAmount],
  );

  const isValidDebtAmount = useMemo(
    () => Number(debtAmount) <= Number(debtTokenBalance),
    [debtAmount, debtTokenBalance],
  );

  const isValidCollateralAmount = useMemo(
    () => Number(collateralAmount) <= Number(maxCollateralAmount),
    [collateralAmount, maxCollateralAmount],
  );

  const collateralRatio = useMemo(() => {
    if ((debtSize.isZero() && collateralSize.isZero()) || !isValidDebtAmount) {
      return Decimal.ZERO;
    }

    const debt = isCollateralWithdrawMode
      ? Decimal.from(loan.debt)
      : newTotalDebt;
    const collateralUsdPrice =
      collateralToken === SupportedTokens.rbtc ? rbtcPrice : collateralPriceUsd;
    const totalDebtUsd = debt.mul(
      debtToken === SupportedTokens.rbtc ? rbtcPrice : borrowPriceUsd,
    );

    return newCollateralAmount
      .mul(collateralUsdPrice)
      .div(totalDebtUsd)
      .mul(100);
  }, [
    collateralSize,
    debtSize,
    isValidDebtAmount,
    isCollateralWithdrawMode,
    newCollateralAmount,
    loan.debt,
    newTotalDebt,
    collateralToken,
    rbtcPrice,
    collateralPriceUsd,
    debtToken,
    borrowPriceUsd,
  ]);

  const isValidCollateralRatio = useMemo(() => {
    if ((collateralSize.isZero() && debtSize.isZero()) || !isValidDebtAmount) {
      return true;
    }
    return collateralRatio.gte(
      MINIMUM_COLLATERAL_RATIO_BORROWING_MAINTENANCE.mul(100),
    );
  }, [collateralRatio, collateralSize, debtSize, isValidDebtAmount]);

  const collateralRatioError = useMemo(() => {
    if (
      collateralRatio.lt(
        MINIMUM_COLLATERAL_RATIO_BORROWING_MAINTENANCE.mul(100),
      )
    ) {
      return t(pageTranslations.labels.collateralRatioError, {
        min: MINIMUM_COLLATERAL_RATIO_BORROWING_MAINTENANCE.mul(100),
      });
    }
    return '';
  }, [collateralRatio]);

  const liquidationPrice = useMemo(() => {
    if (collateralSize.isZero() && debtSize.isZero()) {
      return Decimal.ZERO;
    }

    const debt = isCollateralWithdrawMode
      ? Decimal.from(loan.debt)
      : newTotalDebt;

    return MINIMUM_COLLATERAL_RATIO_BORROWING_MAINTENANCE.mul(debt).div(
      newCollateralAmount,
    );
  }, [
    collateralSize,
    debtSize,
    isCollateralWithdrawMode,
    loan.debt,
    newCollateralAmount,
    newTotalDebt,
  ]);

  useEffect(() => {
    const price = decimalic(
      collateralToken === SupportedTokens.rbtc ? rbtcPrice : collateralPriceUsd,
    ).div(debtToken === SupportedTokens.rbtc ? rbtcPrice : borrowPriceUsd);

    setCollateralAssetPrice(price.toString());
  }, [
    collateralToken,
    borrowPriceUsd,
    rbtcPrice,
    collateralPriceUsd,
    debtToken,
  ]);

  const setCloseDebtTabValues = useCallback(() => {
    setDebtAmount(totalDebtWithoutInterestRefund.toString());
    setCollateralAmount(loan.collateral.toString());
  }, [loan.collateral, totalDebtWithoutInterestRefund]);

  const resetCloseDebtTabValues = useCallback(() => {
    setDebtAmount('');
    setCollateralAmount('');
  }, []);

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
    }

    if (isRepayTab) {
      handleRepay(
        debtSize.toString(),
        loan.id,
        convertLoanTokenToSupportedAssets(loan.debtAsset),
        true,
      );
    }

    if (isBorrowTab) {
      if (debtAmount === '' || debtAmount === '0') {
        handleDepositCollateral(collateralAmount, collateralToken, loan.id);
      } else {
        handleBorrow(
          debtToken,
          debtAmount,
          loan.rolloverDate,
          collateralAmount === '' ? '0' : collateralAmount,
          collateralToken,
          loan.id,
        );
      }
    }

    if (isCollateralWithdrawMode) {
      handleWithdrawCollateral(collateralAmount, loan.id);
    }
  }, [
    collateralAmount,
    collateralToken,
    debtAmount,
    debtSize,
    debtToken,
    handleBorrow,
    handleDepositCollateral,
    handleRepay,
    handleWithdrawCollateral,
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
          setCollateralTab(CollateralTabAction.WithdrawCollateral);
          setDebtTab(value);
          resetCloseDebtTabValues();
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
    [resetCloseDebtTabValues, setCloseDebtTabValues],
  );

  const onCollateralTabChange = useCallback(
    (value: CollateralTabAction) => {
      switch (value) {
        case CollateralTabAction.AddCollateral:
          if (!isBorrowTab) {
            setDebtTab(DebtTabAction.Borrow);
          }
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
    [isBorrowTab, loan.debt, resetCloseDebtTabValues],
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

  useEffect(() => {
    if (isRepayTab && areValuesIdentical(debtSize, maximumRepayAmount)) {
      setDebtTab(DebtTabAction.Close);
      setCloseDebtTabValues();
    }
  }, [
    debtSize,
    isRepayTab,
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
        !isValidDebtAmount ||
        !(Number(debtAmount) <= maxDebtAmount.toNumber())
      );
    }

    if (isBorrowTab) {
      return (
        (debtSize.isZero() && collateralSize.isZero()) ||
        collateralRatioError !== '' ||
        !isValidCollateralAmount ||
        !isValidDebtAmount ||
        !(Number(debtAmount) <= maxDebtAmount.toNumber())
      );
    }

    if (isCollateralWithdrawMode) {
      return (
        collateralSize.isZero() ||
        collateralRatioError !== '' ||
        !isValidCollateralAmount
      );
    }

    if (isCloseTab) {
      return !isValidCloseAmount;
    }
  }, [
    isRepayTab,
    isBorrowTab,
    isCollateralWithdrawMode,
    isCloseTab,
    debtSize,
    isValidDebtAmount,
    collateralSize,
    collateralRatioError,
    isValidCollateralAmount,
    debtAmount,
    maxDebtAmount,
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
          token: debtToken,
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
    () => getCollateralRatioThresholds(),
    [],
  );

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
          <Label
            token={loan.debtAsset}
            maxAmount={maxDebtAmount}
            tabs={DEBT_TABS}
            onTabChange={onDebtTabChange}
            onMaxAmountClicked={() => setDebtAmount(maxDebtAmount.toString())}
            isDisabled={isCloseTab || isCollateralWithdrawMode}
            index={debtTab}
            setIndex={setDebtTab}
          />
        }
        labelElement="div"
        className="w-full"
        dataAttribute="adjust-loan-debt-amount"
        // errorLabel={debtError}
      >
        <div className="w-full flex flex-row justify-between items-center gap-3">
          <AmountInput
            value={debtAmount}
            onChangeText={setDebtAmount}
            maxAmount={maxDebtAmount.toNumber()}
            label={t(translations.common.amount)}
            className="w-full flex-grow-0 flex-shrink"
            placeholder="0"
            disabled={isCloseTab || isCollateralWithdrawMode}
          />
          <AssetRenderer
            dataAttribute="adjust-loan-debt-asset"
            showAssetLogo
            asset={debtToken}
            className="min-w-24 h-10 rounded bg-gray-60 items-center px-4 mr-0"
          />
        </div>
      </FormGroup>
      <FormGroup
        label={
          <Label
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
          />
        }
        labelElement="div"
        className="max-w-none mt-8"
        dataAttribute="adjust-loan-collateral-amount"
        // errorLabel={collateralError}
      >
        <div className="w-full flex flex-row justify-between items-center gap-3">
          <AmountInput
            value={collateralAmountValue}
            onChangeText={setCollateralAmount}
            maxAmount={maxCollateralAmount.toNumber()}
            label={t(translations.common.amount)}
            className="max-w-none"
            // invalid={collateralError}
            placeholder="0"
            disabled={isCloseTab || isRepayTab}
          />
          <AssetRenderer
            dataAttribute="adjust-loan-collateral-asset"
            showAssetLogo
            asset={SupportedTokens[collateralToken]}
            className="min-w-24 h-10 rounded bg-gray-60 items-center px-4 mr-0"
          />
        </div>
      </FormGroup>

      <div className="mt-6">
        <SimpleTable>
          {!isCollateralWithdrawTab && (
            <SimpleTableRow
              label={t(pageTranslations.labels.borrowApr)}
              value={
                <DynamicValue
                  initialValue="0"
                  value={Decimal.fromBigNumberString(borrowApr).toString()}
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
                  value={collateralAssetPrice}
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
          disabled={submitButtonDisabled}
        />
      </div>
    </>
  );
};
