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

import { AssetRenderer } from '../../../../2_molecules/AssetRenderer/AssetRenderer';
import { LoanItem } from '../../../../5_pages/BorrowPage/components/OpenLoansTable/OpenLoansTable.types';
import { useLiquityBaseParams } from '../../../../5_pages/ZeroPage/hooks/useLiquityBaseParams';
import { COLLATERAL_RATIO_THRESHOLDS } from '../../../../../constants/general';
import { getTokenDisplayName } from '../../../../../constants/tokens';
import { useAssetBalance } from '../../../../../hooks/useAssetBalance';
import { useMaxAssetBalance } from '../../../../../hooks/useMaxAssetBalance';
import { useGetRBTCPrice } from '../../../../../hooks/zero/useGetRBTCPrice';
import { translations } from '../../../../../locales/i18n';
import { decimalic } from '../../../../../utils/math';
import { MINIMUM_COLLATERAL_RATIO } from '../../../ZeroLocForm/constants';
import { getOriginationFeeAmount } from '../../../ZeroLocForm/utils';
import {
  COLLATERAL_TABS,
  DEBT_TABS,
  INTEREST_DURATION,
} from './AdjustLoanForm.constants';
import { AmountType } from './AdjustLoanForm.types';
import {
  calculatePreparedInterest,
  normalizeToken,
  renderValue,
} from './AdjustLoanForm.utils';
import { CurrentLoanData } from './components/CurrentLoanData';
import { Label } from './components/Label';
import { useGetBorrowingAPR } from './hooks/useGetBorrowingAPR';
import { useGetCollateralAssetPrice } from './hooks/useGetCollateralAssetPrice';

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
  const [debtType, setDebtType] = useState(AmountType.Borrow);
  const [collateralType, setCollateralType] = useState(AmountType.Add);
  const { minBorrowingFeeRate } = useLiquityBaseParams();
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

  const { borrowApr } = useGetBorrowingAPR(debtToken, debtSize);

  const isCollateralWithdrawType = useMemo(
    () => collateralType === AmountType.Withdraw,
    [collateralType],
  );

  const isDebtCloseType = useMemo(
    () => debtType === AmountType.Close,
    [debtType],
  );

  useEffect(() => {
    if (isDebtCloseType) {
      setDebtAmount(loan.debt.toString());
      setCollateralAmount(loan.collateral.toString());
      setCollateralType(AmountType.Withdraw);
    } else {
      setDebtAmount('');
      setCollateralAmount('');
      setCollateralType(AmountType.Add);
    }
  }, [isDebtCloseType, loan.collateral, loan.debt]);

  const { balance: debtTokenBalance } = useAssetBalance(
    debtToken as SupportedTokens,
  );
  const { borrowPriceUsd, collateralPriceUsd } = useGetCollateralAssetPrice(
    debtToken,
    collateralToken,
  );

  const {
    weiBalance: maxCollateralBalance,
    loading: maxCollateralBalanceLoading,
  } = useMaxAssetBalance(SupportedTokens[collateralToken.toLowerCase()]);

  const maxCollateralAmount = useMemo(
    () =>
      maxCollateralBalanceLoading
        ? Decimal.ZERO
        : Decimal.fromBigNumberString(maxCollateralBalance),
    [maxCollateralBalanceLoading, maxCollateralBalance],
  );

  const originationFee = useMemo(
    () => getOriginationFeeAmount(debtSize, minBorrowingFeeRate),
    [minBorrowingFeeRate, debtSize],
  );

  const newCollateralAmount = useMemo(() => {
    if (collateralAmount === '' || collateralAmount === '0') {
      return Decimal.ZERO;
    }

    return decimalic(loan.collateral.toString()).add(
      collateralSize.sub(originationFee),
    );
  }, [loan.collateral, collateralAmount, originationFee, collateralSize]);

  const preparedInterest = calculatePreparedInterest(
    borrowApr,
    debtSize.toString(),
    INTEREST_DURATION,
  );

  const newTotalDebt = useMemo(() => {
    if (debtSize.isZero()) {
      return Decimal.ZERO;
    }

    return decimalic(loan.debt.toString())
      .add(debtSize)
      .add(preparedInterest.toString());
  }, [loan.debt, debtSize, preparedInterest]);

  const isValidDebtAmount = useMemo(
    () => Number(debtAmount) <= Number(debtTokenBalance),
    [debtAmount, debtTokenBalance],
  );

  const isValidCollateralAmount = useMemo(
    () => Number(collateralAmount) <= Number(maxCollateralAmount),
    [collateralAmount, maxCollateralAmount],
  );

  const collateralRatio = useMemo(() => {
    if (
      [collateralSize, debtSize].some(v => v.isZero()) ||
      !isValidDebtAmount ||
      !isValidCollateralAmount
    ) {
      return Decimal.ZERO;
    }

    return collateralSize.mul(collateralAssetPrice).div(newTotalDebt).mul(100);
  }, [
    collateralSize,
    debtSize,
    isValidDebtAmount,
    isValidCollateralAmount,
    newTotalDebt,
    collateralAssetPrice,
  ]);

  const isValidCollateralRatio = useMemo(() => {
    if (
      collateralSize.isZero() ||
      debtSize.isZero() ||
      !isValidDebtAmount ||
      !isValidCollateralAmount
    ) {
      return true;
    }
    return collateralRatio.gte(MINIMUM_COLLATERAL_RATIO.mul(100));
  }, [
    collateralRatio,
    collateralSize,
    debtSize,
    isValidDebtAmount,
    isValidCollateralAmount,
  ]);

  const collateralRatioError = useMemo(() => {
    if (collateralRatio.lt(MINIMUM_COLLATERAL_RATIO.mul(100))) {
      return t(pageTranslations.labels.collateralRatioError, {
        min: MINIMUM_COLLATERAL_RATIO.mul(100),
      });
    }
    return '';
  }, [collateralRatio]);

  const liquidationPrice = useMemo(() => {
    if (collateralSize.isZero() || debtSize.isZero()) {
      return Decimal.ZERO;
    }

    return MINIMUM_COLLATERAL_RATIO.mul(newTotalDebt.toString()).div(
      collateralSize.toString(),
    );
  }, [collateralSize, debtSize, newTotalDebt]);

  const submitButtonDisabled = useMemo(
    () => debtSize.isZero() || collateralSize.isZero(),
    [debtSize, collateralSize],
  );

  const handleFormSubmit = useCallback(() => {}, []);

  useEffect(() => {
    if (collateralToken === SupportedTokens.rbtc) {
      const price = decimalic(rbtcPrice).div(borrowPriceUsd);
      setCollateralAssetPrice(price.toString());
    } else {
      const price = decimalic(collateralPriceUsd).div(rbtcPrice);
      setCollateralAssetPrice(price.toString());
    }
  }, [collateralToken, borrowPriceUsd, rbtcPrice, collateralPriceUsd]);

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
            maxAmount={debtTokenBalance}
            tabs={DEBT_TABS}
            onTabChange={setDebtType}
            onMaxAmountClicked={() =>
              setDebtAmount(debtTokenBalance.toString())
            }
            isDisabled={isCollateralWithdrawType}
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
            unit={debtToken.toUpperCase()}
            maxAmount={debtTokenBalance.toNumber()}
            label={t(translations.common.amount)}
            className="w-full flex-grow-0 flex-shrink"
            // invalid={debtError}
            placeholder="0"
            disabled={isCollateralWithdrawType || isDebtCloseType}
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
            onTabChange={setCollateralType}
            onMaxAmountClicked={() =>
              setCollateralAmount(maxCollateralAmount.toString())
            }
          />
        }
        labelElement="div"
        className="max-w-none mt-8"
        dataAttribute="adjust-loan-collateral-amount"
        // errorLabel={collateralError}
      >
        <div className="w-full flex flex-row justify-between items-center gap-3">
          <AmountInput
            value={collateralAmount}
            onChangeText={setCollateralAmount}
            maxAmount={maxCollateralAmount.toNumber()}
            label={t(translations.common.amount)}
            className="max-w-none"
            // invalid={collateralError}
            placeholder="0"
            disabled={isDebtCloseType}
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
          {!isCollateralWithdrawType && (
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
          {!isCollateralWithdrawType && (
            <SimpleTableRow
              label={t(pageTranslations.labels.originationFee)}
              value={
                <DynamicValue
                  initialValue="0"
                  value={originationFee.toString()}
                  renderer={value => renderValue(value, debtToken)}
                />
              }
            />
          )}
          {!isDebtCloseType && (
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
          {!isCollateralWithdrawType && (
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
          {isDebtCloseType && (
            <SimpleTableRow
              label={t(pageTranslations.labels.interestRefund)}
              value={
                <DynamicValue
                  initialValue="0"
                  value={'0'}
                  renderer={() => renderValue('0', debtToken)}
                />
              }
            />
          )}
        </SimpleTable>
      </div>

      {!isDebtCloseType && (
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
            start={COLLATERAL_RATIO_THRESHOLDS.START}
            middleStart={COLLATERAL_RATIO_THRESHOLDS.MIDDLE_START}
            middleEnd={COLLATERAL_RATIO_THRESHOLDS.MIDDLE_END}
            end={COLLATERAL_RATIO_THRESHOLDS.END}
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

      {!isDebtCloseType && (
        <div className="mt-6">
          <SimpleTable>
            <SimpleTableRow
              label={t(pageTranslations.labels.liquidationPrice)}
              value={
                <DynamicValue
                  initialValue="0"
                  value={liquidationPrice.toString()}
                  renderer={value => renderValue(value, collateralToken)}
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
