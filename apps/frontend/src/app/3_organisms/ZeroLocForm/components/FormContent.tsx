import React, { useCallback, useMemo, FC } from 'react';

import { useTranslation } from 'react-i18next';

import { SupportedTokens } from '@sovryn/contracts';
import {
  AmountInput,
  Button,
  ButtonStyle,
  ButtonType,
  DynamicValue,
  FormGroup,
  HealthBar,
  HelperButton,
  Select,
  SimpleTable,
} from '@sovryn/ui';

import { ErrorData, ErrorLevel } from '../../../1_atoms/ErrorBadge/ErrorBadge';
import { AssetRenderer } from '../../../2_molecules/AssetRenderer/AssetRenderer';
import { ErrorList } from '../../../2_molecules/ErrorList/ErrorList';
import { BORROW_ASSETS } from '../../../5_pages/ZeroPage/constants';
import { translations } from '../../../../locales/i18n';
import { CR_THRESHOLDS } from '../../../../utils/constants';
import { formatValue } from '../../../../utils/math';
import { tokensToOptions } from '../../../../utils/tokens';
import { CurrentTroveData } from '../CurrentTroveData';
import { Label } from '../Label';
import { Row } from '../Row';
import { AmountType } from '../types';

export type OpenTroveProps = {
  hasTrove: false;
  liquidationReserve: number;
};

export type AdjustTroveProps = {
  hasTrove: true;
  existingDebt: string;
  existingCollateral: string;
  debtType: AmountType;
  onDebtTypeChange: (value: AmountType) => void;
  collateralType: AmountType;
  onCollateralTypeChange: (value: AmountType) => void;
};

export type FormContentProps = {
  rbtcPrice: number;
  borrowingRate: number;
  originationFee: number;
  debtAmount: string;
  maxDebtAmount: number;
  onDebtAmountChange: (value: string) => void;
  debtToken: SupportedTokens;
  onDebtTokenChange: (value: SupportedTokens) => void;
  collateralAmount: string;
  maxCollateralAmount: number;
  onCollateralAmountChange: (value: string) => void;

  initialRatio: number;
  currentRatio: number;

  initialLiquidationPrice: number;
  liquidationPrice: number;

  initialLiquidationPriceInRecoveryMode: number;
  liquidationPriceInRecoveryMode: number;

  totalDebt: number;
  totalCollateral: number;

  onFormSubmit: () => void;
  onFormEdit?: () => void;

  formIsDisabled?: boolean;
  debtError?: string;
  collateralError?: string;
  errors?: ErrorData[];
} & (OpenTroveProps | AdjustTroveProps);

// using props instead of destructuring to make use of the type
export const FormContent: FC<FormContentProps> = props => {
  const { t } = useTranslation();

  const debtTabs = useMemo(
    () => [
      {
        value: AmountType.Add,
        label: t(translations.adjustCreditLine.actions.borrow),
      },
      {
        value: AmountType.Remove,
        label: t(translations.adjustCreditLine.actions.repay),
      },
    ],
    [t],
  );

  const collateralTabs = useMemo(
    () => [
      {
        value: AmountType.Add,
        label: t(
          props.hasTrove
            ? translations.adjustCreditLine.actions.addCollateral
            : translations.adjustCreditLine.actions.collateral,
        ),
      },
      {
        value: AmountType.Remove,
        label: t(translations.adjustCreditLine.actions.withdrawCollateral),
      },
    ],
    [props.hasTrove, t],
  );

  const submitButtonDisabled = useMemo(() => {
    const hasCriticalError =
      (props.errors || []).some(error => error.level === ErrorLevel.Critical) ||
      !!props.debtError ||
      !!props.collateralError;
    const debtSize = Number(props.debtAmount);
    const collateralSize = Number(props.collateralAmount);
    const isFormValid = props.hasTrove
      ? debtSize !== 0 || collateralSize !== 0
      : collateralSize > 0 && debtSize > 0;
    return props.formIsDisabled || hasCriticalError || !isFormValid;
  }, [
    props.collateralAmount,
    props.collateralError,
    props.debtAmount,
    props.debtError,
    props.errors,
    props.formIsDisabled,
    props.hasTrove,
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
  const handleCollateralAmountChange = useCallback(
    (value: string) => {
      props.onCollateralAmountChange(value);
      props.onFormEdit?.();
    },
    [props],
  );

  const handleMaxDebtAmountClick = useCallback(
    () => handleDebtAmountChange(String(props.maxDebtAmount)),
    [handleDebtAmountChange, props.maxDebtAmount],
  );
  const handleMaxCollateralAmountClick = useCallback(
    () => handleCollateralAmountChange(String(props.maxCollateralAmount)),
    [handleCollateralAmountChange, props.maxCollateralAmount],
  );

  const handleFormSubmit = useCallback(() => props.onFormSubmit(), [props]);

  const renderTotalDebt = useCallback(
    (value: number) =>
      value === 0 ? (
        t(translations.common.na)
      ) : (
        <>
          {formatValue(value, 3)} {props.debtToken.toUpperCase()}
        </>
      ),
    [props.debtToken, t],
  );

  const renderFeeAmount = useCallback(
    (value: number) =>
      value === 0 ? (
        t(translations.common.na)
      ) : (
        <>
          {formatValue(value, 3)} {SupportedTokens.zusd.toUpperCase()}
        </>
      ),
    [t],
  );

  const renderTotalCollateral = useCallback(
    (value: number) =>
      value === 0 ? (
        t(translations.common.na)
      ) : (
        <>
          {formatValue(value, 3)} {SupportedTokens.rbtc.toUpperCase()}
        </>
      ),
    [t],
  );

  const renderOriginationFee = useCallback(
    (value: number) =>
      value === 0 ? (
        t(translations.common.na)
      ) : (
        <>
          {formatValue(value, 3)} {SupportedTokens.zusd.toUpperCase()} (
          {formatValue(props.borrowingRate * 100, 2)}%)
        </>
      ),
    [props.borrowingRate, t],
  );

  const renderLiquidationPrice = useCallback(
    (value: number) =>
      value === 0 ? (
        t(translations.common.na)
      ) : (
        <>{formatValue(value, 3)} USD</>
      ),
    [t],
  );

  const renderCollateralRatio = useCallback(
    (value: number) =>
      value === 0 ? t(translations.common.na) : <>{formatValue(value, 3)}%</>,
    [t],
  );

  return (
    <div className="w-full">
      {props.hasTrove && (
        <CurrentTroveData
          debt={props.existingDebt}
          collateral={props.existingCollateral}
          rbtcPrice={props.rbtcPrice || 0}
        />
      )}

      <FormGroup
        label={
          <Label
            symbol={props.debtToken}
            maxAmount={props.maxDebtAmount}
            tabs={debtTabs}
            activeTab={props.hasTrove ? props.debtType : AmountType.Add}
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
            onChangeText={handleDebtAmountChange}
            maxAmount={props.maxDebtAmount}
            label={t(translations.adjustCreditLine.fields.debt.amount)}
            tooltip={t(translations.adjustCreditLine.fields.debt.tooltip)}
            className="w-full flex-grow-0 flex-shrink"
            invalid={!!props.debtError}
          />
          <Select
            value={props.debtToken}
            onChange={props.onDebtTokenChange}
            options={tokensToOptions(BORROW_ASSETS)}
            className="flex-grow flex-shrink-0"
            labelRenderer={({ value }) => (
              <AssetRenderer
                dataAttribute="adjust-credit-line-credit-asset"
                showAssetLogo
                asset={SupportedTokens[value]}
              />
            )}
          />
        </div>
      </FormGroup>
      <FormGroup
        label={
          <Label
            symbol="RBTC"
            maxAmount={props.maxCollateralAmount}
            tabs={collateralTabs}
            activeTab={props.hasTrove ? props.collateralType : AmountType.Add}
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
          maxAmount={props.maxCollateralAmount}
          label={t(translations.adjustCreditLine.fields.collateral.amount)}
          tooltip={t(translations.adjustCreditLine.fields.collateral.tooltip)}
          className="max-w-none"
          unit="RBTC"
          invalid={!!props.collateralError}
        />
      </FormGroup>
      <div className="mt-6">
        <SimpleTable>
          <Row
            label={t(translations.adjustCreditLine.labels.originationFee)}
            tooltip={t(
              translations.adjustCreditLine.labels.originationFeeTooltip,
            )}
            value={
              <DynamicValue
                initialValue={0}
                value={props.originationFee}
                renderer={renderOriginationFee}
              />
            }
          />
          {props.hasTrove ? (
            <>
              <Row
                label={t(translations.adjustCreditLine.labels.newDebt)}
                tooltip={t(translations.adjustCreditLine.labels.newDebtTooltip)}
                value={
                  <DynamicValue
                    initialValue={Number(props.existingDebt)}
                    value={props.totalDebt}
                    renderer={renderTotalDebt}
                  />
                }
              />
              <Row
                label={t(translations.adjustCreditLine.labels.newCollateral)}
                tooltip={t(
                  translations.adjustCreditLine.labels.newCollateralTooltip,
                )}
                value={
                  <DynamicValue
                    initialValue={Number(props.existingCollateral)}
                    value={props.totalCollateral}
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
                tooltip={t(
                  translations.adjustCreditLine.labels
                    .liquidationReserveTooltip,
                )}
                value={
                  <DynamicValue
                    initialValue={0}
                    value={props.liquidationReserve}
                    renderer={renderFeeAmount}
                  />
                }
              />
              <Row
                label={t(translations.adjustCreditLine.labels.totalDebt)}
                tooltip={t(
                  translations.adjustCreditLine.labels.totalDebtTooltip,
                )}
                value={
                  <DynamicValue
                    initialValue={0}
                    value={props.totalDebt}
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
          <HelperButton
            content={t(
              translations.adjustCreditLine.labels.collateralRatioTooltip,
            )}
          />
        </div>
        <div className="text-primary-10">
          <DynamicValue
            initialValue={props.initialRatio}
            value={props.currentRatio}
            renderer={renderCollateralRatio}
          />
        </div>
      </div>
      <HealthBar
        start={CR_THRESHOLDS.start}
        middleStart={CR_THRESHOLDS.middleStart}
        middleEnd={CR_THRESHOLDS.middleEnd}
        end={CR_THRESHOLDS.end}
        value={props.currentRatio}
      />

      <ErrorList errors={props.errors || []} showSingleError />

      <div className="mt-6">
        <SimpleTable>
          <Row
            label={t(translations.adjustCreditLine.labels.liquidationPrice)}
            tooltip={t(
              translations.adjustCreditLine.labels.liquidationPriceTooltip,
            )}
            value={
              <DynamicValue
                initialValue={props.initialLiquidationPrice}
                value={props.liquidationPrice}
                renderer={renderLiquidationPrice}
              />
            }
          />
          <Row
            label={t(
              translations.adjustCreditLine.labels.recoveryLiquidationPrice,
            )}
            tooltip={t(
              translations.adjustCreditLine.labels
                .recoveryLiquidationPriceTooltip,
            )}
            value={
              <DynamicValue
                initialValue={props.initialLiquidationPriceInRecoveryMode}
                value={props.liquidationPriceInRecoveryMode}
                renderer={renderLiquidationPrice}
              />
            }
            valueClassName="text-primary-10"
          />
          <Row
            label={t(translations.adjustCreditLine.labels.rbtcPrice)}
            tooltip={t(translations.adjustCreditLine.labels.rbtcPriceTooltip)}
            value={<>{formatValue(props.rbtcPrice, 3)} USD</>}
          />
        </SimpleTable>
      </div>
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
    </div>
  );
};
