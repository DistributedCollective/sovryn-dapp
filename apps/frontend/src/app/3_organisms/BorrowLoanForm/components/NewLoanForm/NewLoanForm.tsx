import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

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
import { useLiquityBaseParams } from '../../../../5_pages/ZeroPage/hooks/useLiquityBaseParams';
import { BITCOIN } from '../../../../../constants/currencies';
import { COLLATERAL_RATIO_THRESHOLDS } from '../../../../../constants/general';
import { useAssetBalance } from '../../../../../hooks/useAssetBalance';
import { useMaxAssetBalance } from '../../../../../hooks/useMaxAssetBalance';
import { useGetRBTCPrice } from '../../../../../hooks/zero/useGetRBTCPrice';
import { translations } from '../../../../../locales/i18n';
import { LendingPool } from '../../../../../utils/LendingPool';
import { dateFormat } from '../../../../../utils/helpers';
import { decimalic } from '../../../../../utils/math';
import { AdvancedSettings } from '../AdvancedSettings/AdvancedSettings';
import {
  MINIMUM_COLLATERAL_RATIO,
  MIN_BORROWING_DAYS,
} from './NewLoanForm.constants';
import {
  calculatePreparedInterest,
  getOriginationFeeAmount,
  renderValue,
} from './NewLoanForm.utils';
import { useGetBorrowingAPR } from './hooks/useGetBorrowingAPR';
import { useGetCollateralAssetPrice } from './hooks/useGetCollateralAssetPrice';

const pageTranslations = translations.fixedInterestPage;

type NewLoanFormProps = {
  pool: LendingPool;
  onSuccess: () => void;
};

export const NewLoanForm: FC<NewLoanFormProps> = ({ pool }) => {
  const [borrowAmount, setBorrowAmount] = useState('');
  const [collateralAmount, setCollateralAmount] = useState('');
  const borrowSize = useMemo(() => decimalic(borrowAmount), [borrowAmount]);
  const collateralSize = useMemo(
    () => decimalic(collateralAmount),
    [collateralAmount],
  );
  const [hasDisclaimerBeenChecked, setHasDisclaimerBeenChecked] =
    useState(false);
  const borrowToken = useMemo(() => pool.getAsset(), [pool]);
  const { minBorrowingFeeRate } = useLiquityBaseParams();
  const { borrowApr } = useGetBorrowingAPR(borrowToken, borrowSize);
  const { price: rbtcPrice } = useGetRBTCPrice();

  const currentDate = useMemo(() => dayjs(), []);

  const minBorrowingDays = useMemo(
    () => currentDate.add(MIN_BORROWING_DAYS, 'day'),
    [currentDate],
  );
  const [borrowDays, setBorrowDays] = useState(dayjs(minBorrowingDays).unix());
  const { balance: borrowTokenBalance } = useAssetBalance(borrowToken);
  const collateralAssets = useMemo(() => pool.getBorrowCollateral(), [pool]);
  const [collateralAssetPrice, setCollateralAssetPrice] = useState('0');

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

  const { borrowPriceUsd, collateralPriceUsd } = useGetCollateralAssetPrice(
    borrowToken,
    collateralToken,
  );

  const onMaximumBorrowAmountClick = useCallback(
    () => setBorrowAmount(borrowTokenBalance.toString()),
    [borrowTokenBalance, setBorrowAmount],
  );

  const {
    weiBalance: maxCollateralBalance,
    loading: maxCollateralBalanceLoading,
  } = useMaxAssetBalance(collateralToken);

  const maxCollateralAmount = useMemo(
    () =>
      maxCollateralBalanceLoading
        ? Decimal.ZERO
        : Decimal.fromBigNumberString(maxCollateralBalance),
    [maxCollateralBalanceLoading, maxCollateralBalance],
  );

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
    () => Number(borrowAmount) <= Number(borrowTokenBalance),
    [borrowAmount, borrowTokenBalance],
  );

  const isValidCollateralAmount = useMemo(
    () => Number(collateralAmount) <= Number(maxCollateralAmount),
    [collateralAmount, maxCollateralAmount],
  );

  const preparedInterest = calculatePreparedInterest(
    borrowApr,
    borrowSize,
    borrowDays,
    currentDate.unix(),
  );

  const originationFee = useMemo(
    () => getOriginationFeeAmount(borrowSize, minBorrowingFeeRate),
    [minBorrowingFeeRate, borrowSize],
  );

  const totalBorrow = useMemo(
    () => borrowSize.add(preparedInterest),
    [borrowSize, preparedInterest],
  );

  const collateralRatio = useMemo(() => {
    if (
      [collateralSize, totalBorrow].some(v => v.isZero()) ||
      !isValidBorrowAmount ||
      !isValidCollateralAmount
    ) {
      return Decimal.ZERO;
    }
    const price =
      collateralToken === SupportedTokens.rbtc ? rbtcPrice : collateralPriceUsd;
    const totalBorrowUSD = totalBorrow.mul(
      borrowToken === SupportedTokens.rbtc ? rbtcPrice : borrowPriceUsd,
    );

    return collateralSize.mul(price).div(totalBorrowUSD).mul(100);
  }, [
    collateralSize,
    totalBorrow,
    collateralToken,
    rbtcPrice,
    collateralPriceUsd,
    isValidBorrowAmount,
    isValidCollateralAmount,
    borrowToken,
    borrowPriceUsd,
  ]);

  const isValidCollateralRatio = useMemo(() => {
    if (
      collateralSize.isZero() ||
      borrowSize.isZero() ||
      !isValidBorrowAmount ||
      !isValidCollateralAmount
    ) {
      return true;
    }
    return collateralRatio.gte(MINIMUM_COLLATERAL_RATIO.mul(100));
  }, [
    collateralRatio,
    collateralSize,
    borrowSize,
    isValidBorrowAmount,
    isValidCollateralAmount,
  ]);

  const collateralRatioError = useMemo(() => {
    if (collateralRatio.lt(MINIMUM_COLLATERAL_RATIO.mul(100))) {
      return t(pageTranslations.newLoanDialog.labels.collateralRatioError, {
        min: MINIMUM_COLLATERAL_RATIO.mul(100),
      });
    }
    return '';
  }, [collateralRatio]);

  const liquidationPrice = useMemo(() => {
    if (!isValidCollateralRatio) {
      return Decimal.ZERO;
    }
    return decimalic(
      MINIMUM_COLLATERAL_RATIO.mul(borrowSize).div(collateralSize),
    );
  }, [collateralSize, borrowSize, isValidCollateralRatio]);

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

  const submitButtonDisabled = useMemo(() => {
    const isFormValid = collateralSize.gt(0) && borrowSize.gt(0);

    return !isFormValid || !hasDisclaimerBeenChecked || !isValidCollateralRatio;
  }, [
    hasDisclaimerBeenChecked,
    collateralSize,
    borrowSize,
    isValidCollateralRatio,
  ]);

  const handleFormSubmit = useCallback(() => {}, []);

  useEffect(() => {
    if (collateralToken === SupportedTokens.rbtc) {
      setCollateralAssetPrice(rbtcPrice);
    } else {
      setCollateralAssetPrice(collateralPriceUsd);
    }
  }, [collateralPriceUsd, collateralToken, rbtcPrice]);

  return (
    <>
      <div className="flex flex-row justify-between items-center">
        <Paragraph size={ParagraphSize.base} className="font-medium">
          {t(pageTranslations.newLoanDialog.borrow)}
        </Paragraph>

        <MaxButton
          onClick={onMaximumBorrowAmountClick}
          value={borrowTokenBalance}
          token={borrowToken}
          dataAttribute="new-loan-maximum-borrow-amount-button"
        />
      </div>
      <div className="flex flex-row justify-between items-center gap-3 mt-3.5">
        <AmountInput
          value={borrowAmount}
          onChangeText={setBorrowAmount}
          maxAmount={borrowTokenBalance.toNumber()}
          label={t(translations.common.amount)}
          className="flex-grow-0 flex-shrink"
          invalid={!isValidBorrowAmount}
          placeholder="0"
          dataAttribute="new-loan-borrow-amount"
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
        maxDate={Math.floor(minBorrowingDays.unix())}
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
                value={Decimal.fromBigNumberString(borrowApr).toString()}
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
                renderer={value => renderValue(value, borrowToken)}
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
                renderer={value => renderValue(value, collateralToken)}
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
                value={collateralAssetPrice}
                renderer={value => renderValue(value, collateralToken)}
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
                  href="#"
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
