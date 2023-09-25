import React, { FC, useCallback, useMemo, useState } from 'react';

import dayjs from 'dayjs';
import { t } from 'i18next';
import { Trans } from 'react-i18next';

import { SupportedTokens } from '@sovryn/contracts';
import {
  AmountInput,
  Button,
  ButtonStyle,
  ButtonType,
  Checkbox,
  DynamicValue,
  ErrorBadge,
  ErrorLevel,
  HealthBar,
  Link,
  Paragraph,
  ParagraphSize,
  Select,
  SimpleTable,
  SimpleTableRow,
} from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { AssetRenderer } from '../../../../2_molecules/AssetRenderer/AssetRenderer';
import { MaxButton } from '../../../../2_molecules/MaxButton/MaxButton';
import { useGetAvgBorrowingAPR } from '../../../../5_pages/BorrowPage/components/AdjustLoanForm/hooks/useGetAvgBorrowingAPR';
import { useGetBorrowingAPR } from '../../../../5_pages/BorrowPage/components/AdjustLoanForm/hooks/useGetBorrowingAPR';
import { useGetMaintenanceStates } from '../../../../5_pages/BorrowPage/components/AdjustLoanForm/hooks/useGetMaintenanceStates';
import { BITCOIN } from '../../../../../constants/currencies';
import {
  MINIMUM_COLLATERAL_RATIO_LENDING_POOLS_SOV,
  MINIMUM_COLLATERAL_RATIO_LENDING_POOLS,
  MINIMUM_COLLATERAL_RATIO_BORROWING_MAINTENANCE,
} from '../../../../../constants/lending';
import { WIKI_LINKS } from '../../../../../constants/links';
import { useDecimalAmountInput } from '../../../../../hooks/useDecimalAmountInput';
import { useQueryRate } from '../../../../../hooks/useQueryRate';
import { translations } from '../../../../../locales/i18n';
import { LendingPool } from '../../../../../utils/LendingPool';
import { dateFormat } from '../../../../../utils/helpers';
import {
  calculatePrepaidInterestFromTargetDate,
  getCollateralRatioThresholds,
  getOriginationFeeAmount,
  renderValue,
} from '../../BorrowPage.utils';
import { useGetOriginationFee } from '../AdjustLoanForm/hooks/useGetOriginationFee';
import { AdvancedSettings } from '../AdvancedSettings/AdvancedSettings';
import { DEFAULT_LOAN_DURATION } from './NewLoanForm.constants';
import { useBorrow } from './hooks/useBorrow';
import { useGetMaximumBorrowAmount } from './hooks/useGetMaximumBorrowAmount';
import { useGetMaximumCollateralAmount } from './hooks/useGetMaximumCollateralAmount';
import { useGetMaximumFirstRolloverDate } from './hooks/useGetMaximumFirstRolloverDate';

const pageTranslations = translations.fixedInterestPage;

const defaultFirstRolloverDate = dayjs().add(DEFAULT_LOAN_DURATION, 'day');

type NewLoanFormProps = {
  pool: LendingPool;
  onSuccess: () => void;
};

export const NewLoanForm: FC<NewLoanFormProps> = ({ pool }) => {
  const [borrowAmount, setBorrowAmount, borrowSize] = useDecimalAmountInput('');
  const [collateralAmount, setCollateralAmount, collateralSize] =
    useDecimalAmountInput('');

  const [hasDisclaimerBeenChecked, setHasDisclaimerBeenChecked] =
    useState(false);
  const borrowToken = useMemo(() => pool.getAsset(), [pool]);
  const originationFeeRate = useGetOriginationFee();
  const { avgBorrowApr: borrowApr } = useGetAvgBorrowingAPR(borrowToken);
  const { borrowApr: userBorrowApr } = useGetBorrowingAPR(
    borrowToken,
    borrowSize,
  );

  const [borrowDays, setBorrowDays] = useState(
    dayjs(defaultFirstRolloverDate).unix(),
  );
  const collateralAssets = useMemo(() => pool.getBorrowCollateral(), [pool]);

  const sortedCollateralAssets = useMemo(() => {
    const sorted = [...collateralAssets].sort();

    const btcIndex = sorted.findIndex(asset => asset === SupportedTokens.rbtc);

    if (btcIndex !== -1) {
      const btcAsset = sorted.splice(btcIndex, 1);
      sorted.unshift(btcAsset[0]);
    }

    return sorted;
  }, [collateralAssets]);

  const [collateralToken, setCollateralToken] = useState<SupportedTokens>(
    sortedCollateralAssets[0],
  );

  const [collateralToLoanRate] = useQueryRate(collateralToken, borrowToken);

  const isMultipleCollateral = useMemo(
    () => collateralAssets.length > 1,
    [collateralAssets],
  );

  const collateralTokenOptions = useMemo(
    () =>
      sortedCollateralAssets.map(token => ({
        value: token,
        label: (
          <AssetRenderer
            showAssetLogo
            asset={token}
            assetClassName="font-medium"
          />
        ),
      })),
    [sortedCollateralAssets],
  );

  const maximumBorrowAmount = useGetMaximumBorrowAmount(
    borrowToken,
    collateralToken,
    borrowDays,
    borrowApr,
    collateralSize,
  );

  const onMaximumBorrowAmountClick = useCallback(
    () => setBorrowAmount(maximumBorrowAmount.toString()),
    [maximumBorrowAmount, setBorrowAmount],
  );

  const { maximumCollateralAmount: maxCollateralAmount } =
    useGetMaximumCollateralAmount(collateralToken);

  const onCollateralTokenChange = useCallback(
    (value: SupportedTokens) => {
      setCollateralToken(value);
      setCollateralAmount('');
    },
    [setCollateralAmount, setCollateralToken],
  );

  const onMaximumCollateralAmountClick = useCallback(
    () => setCollateralAmount(maxCollateralAmount.toString()),
    [maxCollateralAmount, setCollateralAmount],
  );

  const isValidBorrowAmount = useMemo(
    () => (borrowSize.gt(0) ? borrowSize.lte(maximumBorrowAmount) : true),
    [borrowSize, maximumBorrowAmount],
  );

  const isValidCollateralAmount = useMemo(
    () =>
      collateralSize.gt(0) ? collateralSize.lte(maxCollateralAmount) : true,
    [collateralSize, maxCollateralAmount],
  );

  const preparedInterest = calculatePrepaidInterestFromTargetDate(
    userBorrowApr,
    borrowSize,
    borrowDays,
  );

  const originationFee = useMemo(
    () => getOriginationFeeAmount(collateralSize, originationFeeRate),
    [collateralSize, originationFeeRate],
  );

  const totalBorrow = useMemo(
    () => borrowSize.add(preparedInterest),
    [borrowSize, preparedInterest],
  );

  const minimumCollateralRatio = useMemo(
    () =>
      collateralToken === SupportedTokens.sov
        ? MINIMUM_COLLATERAL_RATIO_LENDING_POOLS_SOV
        : MINIMUM_COLLATERAL_RATIO_LENDING_POOLS,
    [collateralToken],
  );

  const collateralRatio = useMemo(() => {
    if ([collateralSize, totalBorrow, borrowSize].some(v => v.isZero())) {
      return Decimal.ZERO;
    }

    return collateralSize.mul(collateralToLoanRate).div(totalBorrow).mul(100);
  }, [collateralSize, totalBorrow, borrowSize, collateralToLoanRate]);

  const isValidCollateralRatio = useMemo(() => {
    if (collateralSize.isZero() || borrowSize.isZero()) {
      return true;
    }
    return collateralRatio.gte(minimumCollateralRatio.mul(100));
  }, [collateralSize, borrowSize, collateralRatio, minimumCollateralRatio]);

  const collateralRatioError = useMemo(() => {
    if (collateralRatio.lt(minimumCollateralRatio.mul(100))) {
      return t(pageTranslations.newLoanDialog.labels.collateralRatioError, {
        min: minimumCollateralRatio.mul(100),
      });
    }
    return '';
  }, [collateralRatio, minimumCollateralRatio]);

  const liquidationPrice = useMemo(() => {
    if (!isValidCollateralRatio) {
      return Decimal.ZERO;
    }
    return MINIMUM_COLLATERAL_RATIO_BORROWING_MAINTENANCE.mul(borrowSize).div(
      collateralSize,
    );
  }, [isValidCollateralRatio, borrowSize, collateralSize]);

  const renderFirstRolloverDate = useMemo(() => {
    if (borrowSize.lte(Decimal.ZERO) || collateralSize.lte(Decimal.ZERO)) {
      return t(translations.common.na);
    }

    return dateFormat(borrowDays);
  }, [borrowSize, collateralSize, borrowDays]);

  const isAdvancedSettingsDisabled = useMemo(
    () => borrowSize.lte(Decimal.ZERO) || collateralSize.lte(Decimal.ZERO),
    [borrowSize, collateralSize],
  );

  const handleSubmit = useBorrow();
  const handleFormSubmit = useCallback(() => {
    handleSubmit(
      borrowToken,
      borrowAmount,
      borrowDays,
      collateralAmount,
      collateralToken,
    );
  }, [
    borrowAmount,
    borrowDays,
    borrowToken,
    collateralAmount,
    collateralToken,
    handleSubmit,
  ]);

  const maximumFirstRolloverDate = useGetMaximumFirstRolloverDate(
    collateralSize,
    borrowSize,
    collateralToken,
    borrowToken,
  );

  const collateralRatioThresholds = useMemo(
    () => getCollateralRatioThresholds(collateralToken),
    [collateralToken],
  );

  const { isBorrowLocked } = useGetMaintenanceStates(borrowToken);

  const submitButtonDisabled = useMemo(() => {
    const isFormValid =
      collateralSize.gt(0) &&
      borrowSize.gt(0) &&
      collateralSize.lte(maxCollateralAmount) &&
      borrowSize.lte(maximumBorrowAmount);

    return (
      !isFormValid ||
      !hasDisclaimerBeenChecked ||
      !isValidCollateralRatio ||
      isBorrowLocked
    );
  }, [
    collateralSize,
    borrowSize,
    maxCollateralAmount,
    maximumBorrowAmount,
    hasDisclaimerBeenChecked,
    isValidCollateralRatio,
    isBorrowLocked,
  ]);

  return (
    <>
      <div className="flex flex-row justify-between items-center">
        <Paragraph size={ParagraphSize.base} className="font-medium">
          {t(pageTranslations.newLoanDialog.borrow)}
        </Paragraph>

        <MaxButton
          onClick={onMaximumBorrowAmountClick}
          value={maximumBorrowAmount}
          token={borrowToken}
          dataAttribute="new-loan-maximum-borrow-amount-button"
        />
      </div>
      <div className="flex flex-row justify-between items-center gap-3 mt-3.5">
        <AmountInput
          value={borrowAmount}
          onChangeText={setBorrowAmount}
          maxAmount={maximumBorrowAmount.toNumber()}
          label={t(translations.common.amount)}
          className="flex-grow-0 flex-shrink"
          invalid={!isValidBorrowAmount}
          placeholder="0"
          dataAttribute="new-loan-borrow-amount"
          disabled={isBorrowLocked}
        />
        <AssetRenderer
          dataAttribute="new-loan-borrow-asset"
          showAssetLogo
          asset={SupportedTokens[borrowToken]}
          className="min-w-[6.7rem] h-10 rounded bg-gray-60 items-center px-4 mr-0"
        />
      </div>
      {!isValidBorrowAmount && (
        <ErrorBadge
          level={ErrorLevel.Critical}
          message={t(pageTranslations.newLoanDialog.invalidAmountError)}
          dataAttribute="new-loan-borrow-amount-error"
        />
      )}
      {isBorrowLocked && (
        <ErrorBadge
          level={ErrorLevel.Warning}
          message={t(translations.maintenanceMode.featureDisabled)}
        />
      )}

      <div className="flex flex-row justify-between items-center mt-6">
        <Paragraph size={ParagraphSize.base} className="font-medium">
          {t(pageTranslations.newLoanDialog.collateral)}
        </Paragraph>

        <MaxButton
          onClick={onMaximumCollateralAmountClick}
          value={maxCollateralAmount}
          token={collateralToken}
          dataAttribute="new-loan-maximum-collateral-amount-button"
        />
      </div>
      <div className="flex flex-row justify-between items-center gap-3 mt-3.5">
        <AmountInput
          value={collateralAmount}
          onChangeText={setCollateralAmount}
          maxAmount={maxCollateralAmount.toNumber()}
          label={t(translations.common.amount)}
          className="flex-grow-0 flex-shrink"
          invalid={!isValidCollateralAmount}
          placeholder="0"
          dataAttribute="new-loan-collateral-amount"
          disabled={isBorrowLocked}
        />
        {isMultipleCollateral ? (
          <Select
            value={collateralToken}
            onChange={onCollateralTokenChange}
            options={collateralTokenOptions}
            labelRenderer={({ value }) => (
              <AssetRenderer
                dataAttribute="new-loan-collateral-asset"
                showAssetLogo
                asset={SupportedTokens[value]}
              />
            )}
            className="min-w-[6.7rem]"
            menuClassName="max-h-[10rem] sm:max-h-[20rem]"
            dataAttribute="new-loan-collateral-select"
          />
        ) : (
          <AssetRenderer
            dataAttribute="new-loan-collateral-asset"
            showAssetLogo
            asset={SupportedTokens[collateralToken]}
            className="min-w-[6.7rem] h-10 rounded bg-gray-60 items-center px-4 mr-0"
          />
        )}
      </div>
      {!isValidCollateralAmount && (
        <ErrorBadge
          level={ErrorLevel.Critical}
          message={t(pageTranslations.newLoanDialog.invalidAmountError)}
          dataAttribute="new-loan-collateral-amount-error"
        />
      )}

      <AdvancedSettings
        date={borrowDays}
        onChange={setBorrowDays}
        maxDate={maximumFirstRolloverDate}
        className="mt-6"
        disabled={isAdvancedSettingsDisabled}
      />

      <div className="mt-6">
        <SimpleTable>
          <SimpleTableRow
            label={t(pageTranslations.newLoanDialog.labels.borrowApr)}
            value={
              <DynamicValue
                initialValue="0"
                value={Decimal.fromBigNumberString(
                  userBorrowApr.toString(),
                ).toString()}
                renderer={value => renderValue(value, '%', 0)}
              />
            }
          />
          <SimpleTableRow
            label={t(pageTranslations.newLoanDialog.labels.firstRolloverDate)}
            value={renderFirstRolloverDate}
          />
          <SimpleTableRow
            label={t(pageTranslations.newLoanDialog.labels.preparedInterest)}
            value={
              <DynamicValue
                initialValue="0"
                value={preparedInterest.toString()}
                renderer={value => renderValue(value, borrowToken)}
              />
            }
          />
          <SimpleTableRow
            label={t(pageTranslations.newLoanDialog.labels.originationFee)}
            value={
              <DynamicValue
                initialValue="0"
                value={originationFee.toString()}
                renderer={value => renderValue(value, collateralToken)}
              />
            }
          />
          <SimpleTableRow
            label={t(pageTranslations.newLoanDialog.labels.totalDebt)}
            value={
              <DynamicValue
                initialValue="0"
                value={totalBorrow.toString()}
                renderer={value => renderValue(value, borrowToken)}
              />
            }
          />
        </SimpleTable>
      </div>

      <div className="flex flex-row justify-between items-center mt-6 mb-3">
        <div className="flex flex-row justify-start items-center gap-2">
          <span>{t(translations.adjustCreditLine.labels.collateralRatio)}</span>
        </div>
        <div className="text-primary-10">
          <DynamicValue
            initialValue="0"
            value={collateralRatio.toString()}
            renderer={value => renderValue(value, '%', 3)}
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
          dataAttribute="new-loan-collateral-ratio-error"
        />
      )}

      <div className="mt-6">
        <SimpleTable>
          <SimpleTableRow
            label={t(pageTranslations.newLoanDialog.labels.liquidationPrice)}
            value={
              <DynamicValue
                initialValue="0"
                value={liquidationPrice.toString()}
                renderer={value => renderValue(value, borrowToken)}
              />
            }
          />
          <SimpleTableRow
            label={t(pageTranslations.newLoanDialog.labels.collateralPrice, {
              token:
                collateralToken === SupportedTokens.rbtc
                  ? BITCOIN
                  : collateralToken.toLocaleUpperCase(),
            })}
            value={
              <DynamicValue
                initialValue="0"
                value={collateralToLoanRate.toString()}
                renderer={value => renderValue(value, borrowToken)}
              />
            }
          />
        </SimpleTable>
      </div>

      <div className="mt-6">
        <Checkbox
          checked={hasDisclaimerBeenChecked}
          onChangeValue={setHasDisclaimerBeenChecked}
          label={
            <Trans
              i18nKey={pageTranslations.newLoanDialog.labels.disclaimer}
              components={[
                <Link
                  text={t(pageTranslations.newLoanDialog.labels.disclaimerCTA)}
                  href={WIKI_LINKS.BORROWING}
                  className="no-underline"
                />,
              ]}
            />
          }
        />
      </div>

      <div className="mt-8 flex flex-row items-center justify-between gap-8">
        <Button
          type={ButtonType.submit}
          style={ButtonStyle.primary}
          text={t(translations.common.buttons.confirm)}
          className="w-full"
          onClick={handleFormSubmit}
          dataAttribute="new-loan-confirm-button"
          disabled={submitButtonDisabled}
        />
      </div>
    </>
  );
};
