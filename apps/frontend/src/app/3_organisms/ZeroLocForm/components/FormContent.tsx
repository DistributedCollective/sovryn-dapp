import React, { useCallback, useMemo, FC, useState } from 'react';

import { t } from 'i18next';
import { Trans } from 'react-i18next';

import {
  AmountInput,
  Button,
  ButtonStyle,
  ButtonType,
  Checkbox,
  DynamicValue,
  ErrorBadge,
  ErrorBadgeProps,
  ErrorLevel,
  ErrorList,
  FormGroup,
  HealthBar,
  Link,
  Select,
  SimpleTable,
} from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { AdvancedSettings } from '../../../2_molecules/AdvancedSettings/AdvancedSettings';
import { AmountRenderer } from '../../../2_molecules/AmountRenderer/AmountRenderer';
import { AssetRenderer } from '../../../2_molecules/AssetRenderer/AssetRenderer';
import { BORROW_ASSETS } from '../../../5_pages/ZeroPage/constants';
import { useLiquityBaseParams } from '../../../5_pages/ZeroPage/hooks/useLiquityBaseParams';
import {
  BITCOIN,
  BTC_RENDER_PRECISION,
  TOKEN_RENDER_PRECISION,
  USD,
} from '../../../../constants/currencies';
import { COLLATERAL_RATIO_THRESHOLDS } from '../../../../constants/general';
import { WIKI_LINKS } from '../../../../constants/links';
import { useMaintenance } from '../../../../hooks/useMaintenance';
import { translations } from '../../../../locales/i18n';
import { formatValue, decimalic } from '../../../../utils/math';
import { CurrentTroveData } from '../CurrentTroveData';
import { Label } from '../Label';
import { Row } from '../Row';
import { AmountType } from '../types';
import { COMMON_SYMBOLS } from '../../../../utils/asset';

export type OpenTroveProps = {
  hasTrove: false;
  liquidationReserve: Decimal;
};

export type AdjustTroveProps = {
  hasTrove: true;
  existingDebt: Decimal;
  existingCollateral: Decimal;
  debtType: AmountType;
  onDebtTypeChange: (value: AmountType) => void;
  collateralType: AmountType;
  onCollateralTypeChange: (value: AmountType) => void;
};

export type FormContentProps = {
  rbtcPrice: Decimal;
  borrowingRate: Decimal;
  originationFee: Decimal;
  maxOriginationFeeRate: string;
  onMaxOriginationFeeRateChange: (value: string) => void;
  debtAmount: string;
  maxDebtAmount: Decimal;
  onDebtAmountChange: (value: string) => void;
  debtToken: string;
  onDebtTokenChange: (value: string) => void;
  collateralAmount: string;
  maxCollateralAmount: Decimal;
  onCollateralAmountChange: (value: string) => void;

  initialRatio: Decimal;
  currentRatio: Decimal;

  initialLiquidationPrice: Decimal;
  liquidationPrice: Decimal;

  initialLiquidationPriceInRecoveryMode: Decimal;
  liquidationPriceInRecoveryMode: Decimal;

  totalDebt: Decimal;
  totalCollateral: Decimal;

  onFormSubmit: () => void;
  onFormEdit?: () => void;

  formIsDisabled?: boolean;
  debtError?: string;
  collateralError?: string;
  errors?: ErrorBadgeProps[];
} & (OpenTroveProps | AdjustTroveProps);

const ACTIVE_CLASSNAME = 'bg-gray-70 text-primary-20';

// using props instead of destructuring to make use of the type
export const FormContent: FC<FormContentProps> = props => {
  const { checkMaintenance, States } = useMaintenance();
  const actionLocked = checkMaintenance(
    props.hasTrove ? States.ZERO_ADJUST_LOC : States.ZERO_OPEN_LOC,
  );
  const borrowLocked = checkMaintenance(States.ZERO_ADJUST_LOC_BORROW);
  const dllrLocked = checkMaintenance(States.ZERO_DLLR);

  const [hasDisclaimerBeenChecked, setHasDisclaimerBeenChecked] =
    useState(false);

  const debtTabs = useMemo(
    () => [
      {
        amountType: AmountType.Add,
        label: t(translations.adjustCreditLine.actions.borrow),
        activeClassName: ACTIVE_CLASSNAME,
      },
      {
        amountType: AmountType.Remove,
        label: t(translations.adjustCreditLine.actions.repay),
        activeClassName: ACTIVE_CLASSNAME,
      },
    ],
    [],
  );

  const collateralTabs = useMemo(
    () => [
      {
        amountType: AmountType.Add,
        label: t(
          props.hasTrove
            ? translations.adjustCreditLine.actions.addCollateral
            : translations.adjustCreditLine.actions.collateral,
        ),
        activeClassName: ACTIVE_CLASSNAME,
      },
      {
        amountType: AmountType.Remove,
        label: t(translations.adjustCreditLine.actions.withdrawCollateral),
        activeClassName: ACTIVE_CLASSNAME,
      },
    ],
    [props.hasTrove],
  );

  const isBorrowDisabled = useMemo(
    () => borrowLocked && props.hasTrove && props.debtType === AmountType.Add,
    [borrowLocked, props],
  );

  const { minBorrowingFeeRate, maxBorrowingFeeRate } = useLiquityBaseParams();

  const minOriginationFeeRate = useMemo(
    () => minBorrowingFeeRate.mul(100),
    [minBorrowingFeeRate],
  );
  const maxOriginationFeeRate = useMemo(
    () => maxBorrowingFeeRate.mul(100),
    [maxBorrowingFeeRate],
  );

  const isInvalidOriginationFee = useMemo(
    () =>
      decimalic(props.maxOriginationFeeRate).lt(minOriginationFeeRate) ||
      decimalic(props.maxOriginationFeeRate).gt(maxOriginationFeeRate),
    [props.maxOriginationFeeRate, minOriginationFeeRate, maxOriginationFeeRate],
  );

  const isInMaintenance = useMemo(
    () =>
      actionLocked || (dllrLocked && props.debtToken === COMMON_SYMBOLS.DLLR),
    [actionLocked, dllrLocked, props.debtToken],
  );

  const submitButtonDisabled = useMemo(() => {
    const hasCriticalError =
      (props.errors || []).some(error => error.level === ErrorLevel.Critical) ||
      !!props.debtError ||
      !!props.collateralError;
    const debtSize = decimalic(props.debtAmount);
    const collateralSize = decimalic(props.collateralAmount);

    const isFormValid = props.hasTrove
      ? !debtSize.isZero() || !collateralSize.isZero()
      : collateralSize.gt(0) && debtSize.gt(0);

    return (
      props.formIsDisabled ||
      hasCriticalError ||
      !isFormValid ||
      isInMaintenance ||
      (isBorrowDisabled && Number(props.debtAmount) > 0) ||
      isInvalidOriginationFee ||
      (!props.hasTrove && !hasDisclaimerBeenChecked)
    );
  }, [
    props.errors,
    props.debtError,
    props.collateralError,
    props.debtAmount,
    props.collateralAmount,
    props.hasTrove,
    props.formIsDisabled,
    isInMaintenance,
    isBorrowDisabled,
    isInvalidOriginationFee,
    hasDisclaimerBeenChecked,
  ]);

  const handleDebtTypeChange = useCallback(
    (value: AmountType) => {
      if (props.hasTrove) {
        props.onDebtTypeChange(value);
        props.onFormEdit?.();
      }
    },
    [props],
  );
  const handleCollateralTypeChange = useCallback(
    (value: AmountType) => {
      if (props.hasTrove) {
        props.onCollateralTypeChange(value);
        props.onFormEdit?.();
      }
    },
    [props],
  );

  const handleDebtAmountChange = useCallback(
    (value: string) => {
      props.onDebtAmountChange(value);
      props.onFormEdit?.();
    },
    [props],
  );

  const handleMaxOriginationFeeRateChange = useCallback(
    (value: string) => {
      props.onMaxOriginationFeeRateChange(value);
      props.onFormEdit?.();
    },
    [props],
  );

  const handleCollateralAmountChange = useCallback(
    (value: string) => {
      props.onCollateralAmountChange(value);
      props.onFormEdit?.();
    },
    [props],
  );

  const handleMaxDebtAmountClick = useCallback(
    () => handleDebtAmountChange(props.maxDebtAmount.toString()),
    [handleDebtAmountChange, props.maxDebtAmount],
  );
  const handleMaxCollateralAmountClick = useCallback(
    () => handleCollateralAmountChange(props.maxCollateralAmount.toString()),
    [handleCollateralAmountChange, props.maxCollateralAmount],
  );

  const handleFormSubmit = useCallback(() => props.onFormSubmit(), [props]);

  const renderTotalDebt = useCallback(
    (value: string) =>
      decimalic(value).isZero() ? (
        t(translations.common.na)
      ) : (
        <AmountRenderer
          value={value}
          suffix={COMMON_SYMBOLS.ZUSD}
          precision={TOKEN_RENDER_PRECISION}
        />
      ),
    [],
  );

  const renderTotalCollateral = useCallback(
    (value: string) =>
      decimalic(value).isZero() ? (
        t(translations.common.na)
      ) : (
        <AmountRenderer
          value={value}
          suffix={BITCOIN}
          precision={BTC_RENDER_PRECISION}
        />
      ),
    [],
  );

  const renderOriginationFee = useCallback(
    (value: string) =>
      decimalic(value).isZero() ? (
        t(translations.common.na)
      ) : (
        <>
          <AmountRenderer
            value={value}
            suffix={COMMON_SYMBOLS.ZUSD}
            precision={TOKEN_RENDER_PRECISION}
          />{' '}
          ({formatValue(props.borrowingRate.mul(100), 2)}%)
        </>
      ),
    [props.borrowingRate],
  );

  const renderLiquidationPrice = useCallback(
    (value: string) =>
      decimalic(value).isZero() ? (
        t(translations.common.na)
      ) : (
        <AmountRenderer
          value={value}
          suffix={USD}
          precision={0}
          showRoundingPrefix={false}
        />
      ),
    [],
  );

  const renderRBTCPrice = useCallback(
    (value: string) =>
      decimalic(value).isZero() ? (
        t(translations.common.na)
      ) : (
        <AmountRenderer value={value} suffix={USD} precision={0} />
      ),
    [],
  );

  const renderCollateralRatio = useCallback(
    (value: string) =>
      decimalic(value).isZero() ? (
        t(translations.common.na)
      ) : (
        <>{formatValue(value, 3)}%</>
      ),
    [],
  );

  const tokenOptions = useMemo(
    () =>
      BORROW_ASSETS.map(token => ({
        value: token,
        label: (
          <AssetRenderer
            showAssetLogo
            asset={token}
            assetClassName="font-medium"
          />
        ),
      })),
    [],
  );

  return (
    <div className="w-full">
      {props.hasTrove && (
        <CurrentTroveData
          debt={props.existingDebt}
          collateral={props.existingCollateral}
          rbtcPrice={props.rbtcPrice || Decimal.ZERO}
        />
      )}

      <FormGroup
        label={
          <Label
            token={props.debtToken}
            maxAmount={props.maxDebtAmount}
            tabs={debtTabs}
            onTabChange={handleDebtTypeChange}
            onMaxAmountClicked={handleMaxDebtAmountClick}
            hasTrove={props.hasTrove}
          />
        }
        labelElement="div"
        className="w-full"
        dataAttribute="adjust-credit-line-credit-amount"
        errorLabel={props.debtError}
      >
        <div className="w-full flex flex-row justify-between items-center gap-3">
          <AmountInput
            value={props.debtAmount}
            disabled={isBorrowDisabled}
            onChangeText={handleDebtAmountChange}
            maxAmount={props.maxDebtAmount.toNumber()}
            label={t(translations.common.amount)}
            className="w-full flex-grow-0 flex-shrink"
            invalid={!!props.debtError}
            placeholder="0"
          />
          <Select
            value={props.debtToken}
            onChange={props.onDebtTokenChange}
            options={tokenOptions}
            className="flex-grow flex-shrink-0"
            labelRenderer={({ value }) => (
              <AssetRenderer
                dataAttribute="adjust-credit-line-credit-asset"
                showAssetLogo
                asset={value}
              />
            )}
          />
        </div>
        {isBorrowDisabled && (
          <ErrorBadge
            level={ErrorLevel.Warning}
            message={t(translations.maintenanceMode.featureDisabled)}
          />
        )}
      </FormGroup>
      <FormGroup
        label={
          <Label
            token={COMMON_SYMBOLS.BTC}
            maxAmount={props.maxCollateralAmount}
            tabs={collateralTabs}
            onTabChange={handleCollateralTypeChange}
            onMaxAmountClicked={handleMaxCollateralAmountClick}
            hasTrove={props.hasTrove}
          />
        }
        labelElement="div"
        className="max-w-none mt-8"
        dataAttribute="adjust-credit-line-collateral-amount"
        errorLabel={props.collateralError}
      >
        <AmountInput
          value={props.collateralAmount}
          onChangeText={handleCollateralAmountChange}
          maxAmount={props.maxCollateralAmount.toNumber()}
          label={t(translations.common.amount)}
          className="max-w-none"
          unit={BITCOIN}
          invalid={!!props.collateralError}
          placeholder="0"
        />
      </FormGroup>

      <AdvancedSettings
        amount={props.maxOriginationFeeRate}
        onChange={handleMaxOriginationFeeRateChange}
        className="mt-6"
        invalid={isInvalidOriginationFee}
        errorMessage={t(translations.advancedSettings.errorMessage, {
          min: minOriginationFeeRate,
          max: maxOriginationFeeRate,
        })}
      />

      <div className="mt-6">
        <SimpleTable>
          <Row
            label={t(translations.adjustCreditLine.labels.originationFee)}
            value={
              <DynamicValue
                initialValue="0"
                value={props.originationFee.toString()}
                renderer={renderOriginationFee}
              />
            }
          />
          {props.hasTrove ? (
            <>
              <Row
                label={t(translations.adjustCreditLine.labels.newDebt)}
                value={
                  <DynamicValue
                    initialValue={props.existingDebt.toString()}
                    value={props.totalDebt.toString()}
                    renderer={renderTotalDebt}
                  />
                }
              />
              <Row
                label={t(translations.adjustCreditLine.labels.newCollateral)}
                value={
                  <DynamicValue
                    initialValue={props.existingCollateral.toString()}
                    value={props.totalCollateral.toString()}
                    renderer={renderTotalCollateral}
                  />
                }
              />
            </>
          ) : (
            <>
              <Row
                label={t(
                  translations.adjustCreditLine.labels.liquidationReserve,
                )}
                value={
                  <DynamicValue
                    initialValue="0"
                    value={props.liquidationReserve.toString()}
                    renderer={renderTotalDebt}
                  />
                }
              />
              <Row
                label={t(translations.adjustCreditLine.labels.totalDebt)}
                value={
                  <DynamicValue
                    initialValue="0"
                    value={props.totalDebt.toString()}
                    renderer={renderTotalDebt}
                  />
                }
              />
            </>
          )}
        </SimpleTable>
      </div>

      <div className="flex flex-row justify-between items-center mt-6 mb-3">
        <div className="flex flex-row justify-start items-center gap-2">
          <span>{t(translations.adjustCreditLine.labels.collateralRatio)}</span>
        </div>
        <div className="text-primary-10">
          <DynamicValue
            initialValue={props.initialRatio.toString()}
            value={props.currentRatio.toString()}
            renderer={renderCollateralRatio}
          />
        </div>
      </div>
      <HealthBar
        start={COLLATERAL_RATIO_THRESHOLDS.START}
        middleStart={COLLATERAL_RATIO_THRESHOLDS.MIDDLE_START}
        middleEnd={COLLATERAL_RATIO_THRESHOLDS.MIDDLE_END}
        end={COLLATERAL_RATIO_THRESHOLDS.END}
        value={props.currentRatio.toNumber()}
      />

      <ErrorList errors={props.errors || []} showSingleError />

      <div className="mt-6">
        <SimpleTable>
          <Row
            label={t(translations.adjustCreditLine.labels.liquidationPrice)}
            value={
              <DynamicValue
                initialValue={props.initialLiquidationPrice.toString()}
                value={props.liquidationPrice.toString()}
                renderer={renderLiquidationPrice}
              />
            }
          />
          <Row
            label={t(
              translations.adjustCreditLine.labels.recoveryLiquidationPrice,
            )}
            value={
              <DynamicValue
                initialValue={props.initialLiquidationPriceInRecoveryMode.toString()}
                value={props.liquidationPriceInRecoveryMode.toString()}
                renderer={renderLiquidationPrice}
              />
            }
            valueClassName="text-primary-10"
          />
          <Row
            label={t(translations.adjustCreditLine.labels.rbtcPrice)}
            value={
              <DynamicValue
                initialValue="0"
                value={props.rbtcPrice.toString()}
                renderer={renderRBTCPrice}
              />
            }
          />
        </SimpleTable>
      </div>
      {!props.hasTrove && (
        <div className="mt-4">
          <Checkbox
            checked={hasDisclaimerBeenChecked}
            onChangeValue={setHasDisclaimerBeenChecked}
            label={
              <Trans
                i18nKey={t(translations.adjustCreditLine.labels.disclaimer)}
                components={[
                  <Link
                    text={t(translations.adjustCreditLine.labels.disclaimerCTA)}
                    href={WIKI_LINKS.RISKS}
                  />,
                ]}
              />
            }
          />
        </div>
      )}

      <div className="mt-8 flex flex-row items-center justify-between gap-8">
        <Button
          type={ButtonType.submit}
          style={ButtonStyle.primary}
          text={t(translations.common.buttons.confirm)}
          className="w-full"
          onClick={handleFormSubmit}
          dataAttribute="adjust-credit-line-confirm-button"
          disabled={submitButtonDisabled}
        />
      </div>
      {isInMaintenance && (
        <ErrorBadge
          level={ErrorLevel.Warning}
          message={t(translations.maintenanceMode.featureDisabled)}
        />
      )}
    </div>
  );
};
