import { Fees } from '@sovryn-zero/lib-base';

import React, { ChangeEvent, useCallback, useMemo, useState, FC } from 'react';

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

import { AssetRenderer } from '../../2_molecules/AssetRenderer/AssetRenderer';
import { useAssetBalance } from '../../../hooks/useAssetBalance';
import { translations } from '../../../locales/i18n';
import { CR_THRESHOLDS } from '../../../utils/constants';
import { formatValue, fromWei } from '../../../utils/math';
import { CurrentTroveData } from './CurrentTroveData';
import { Label } from './Label';
import { Row } from './Row';
import { AmountType, tokens } from './types';
import { normalizeAmountByType } from './utils';

export enum AdjustCreditLineType {
  Open,
  Adjust,
}

export type SubmitValue = {
  borrow: string;
  repay: string;
  depositCollateral: string;
  withdrawCollateral: string;
};

type AdjustCreditLineProps = {
  type: AdjustCreditLineType;
  collateralValue: string;
  creditValue: string;
  onSubmit: (value: SubmitValue) => void;
  rbtcPrice?: string;
  fees?: Fees;
};

export const AdjustCreditLine: FC<AdjustCreditLineProps> = ({
  type,
  collateralValue,
  creditValue,
  onSubmit,
  rbtcPrice,
  fees,
}) => {
  const [debtType, setDebtType] = useState(AmountType.Add);
  const [collateralType, setCollateralType] = useState(AmountType.Add);

  const [collateralAmount, setCollateralAmount] = useState('0');
  const [creditAmount, setCreditAmount] = useState('0');
  const [creditToken, setCreditToken] = useState<SupportedTokens>(
    SupportedTokens.zusd,
  );

  const { value: creditBalanceInWei } = useAssetBalance(creditToken);

  const { value: maxCollateralAmountWei } = useAssetBalance(
    SupportedTokens.rbtc,
  );

  const newDebt = useMemo(
    () =>
      Number(creditValue) +
      normalizeAmountByType(Number(creditAmount), debtType),
    [creditAmount, creditValue, debtType],
  );
  const newCollateral = useMemo(
    () =>
      Number(collateralValue) +
      normalizeAmountByType(Number(collateralAmount), collateralType),
    [collateralAmount, collateralType, collateralValue],
  );

  const maxCollateralAmount = useMemo(
    () =>
      Number(
        collateralType === AmountType.Add
          ? fromWei(maxCollateralAmountWei)
          : collateralValue,
      ),
    [collateralType, collateralValue, maxCollateralAmountWei],
  );

  const maxCreditAmount = useMemo(() => {
    return Number(
      debtType === AmountType.Add
        ? (maxCollateralAmount * Number(rbtcPrice || '0')) / 1.1
        : Math.min(Number(fromWei(creditBalanceInWei)), Number(creditValue)),
    );
  }, [
    debtType,
    maxCollateralAmount,
    rbtcPrice,
    creditBalanceInWei,
    creditValue,
  ]);

  const handleMaxCollateralAmountClick = useCallback(
    () => setCollateralAmount(String(maxCollateralAmount)),
    [maxCollateralAmount],
  );

  const handleMaxCreditAmountClick = useCallback(
    () => setCreditAmount(String(maxCreditAmount)),
    [maxCreditAmount],
  );

  const handleCollateralAmountChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) =>
      setCollateralAmount(event.currentTarget.value),
    [],
  );

  const handleCreditAmountChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) =>
      setCreditAmount(event.currentTarget.value),
    [],
  );

  const handleFormSubmit = useCallback(() => {
    let value: Partial<SubmitValue> = {};

    if (debtType === AmountType.Add) {
      value.borrow = creditAmount;
    }

    if (debtType === AmountType.Remove) {
      value.repay = creditAmount;
    }

    if (collateralType === AmountType.Add) {
      value.depositCollateral = collateralAmount;
    }

    if (collateralType === AmountType.Remove) {
      value.withdrawCollateral = collateralAmount;
    }

    onSubmit(value as SubmitValue);
  }, [collateralAmount, collateralType, creditAmount, debtType, onSubmit]);

  const initialRatio = useMemo(() => {
    if ([collateralValue, creditValue, rbtcPrice].some(v => !v)) {
      return 0;
    }
    return (
      ((Number(collateralValue) * Number(rbtcPrice)) / Number(creditValue)) *
      100
    );
  }, [collateralValue, creditValue, rbtcPrice]);

  const ratio = useMemo(() => {
    if ([newCollateral, newDebt, rbtcPrice].some(v => !v)) {
      return 0;
    }
    return (
      ((Number(newCollateral) * Number(rbtcPrice)) / Number(newDebt)) * 100
    );
  }, [newCollateral, newDebt, rbtcPrice]);

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
        disabled: type === AdjustCreditLineType.Open,
      },
    ],
    [t, type],
  );

  const collateralTabs = useMemo(
    () => [
      {
        value: AmountType.Add,
        label: t(translations.adjustCreditLine.actions.addCollateral),
      },
      {
        value: AmountType.Remove,
        label: t(translations.adjustCreditLine.actions.withdrawCollateral),
        disabled: type === AdjustCreditLineType.Open,
      },
    ],
    [t, type],
  );

  const newDebtRenderer = useCallback(
    (value: number) =>
      value === 0 ? (
        t(translations.common.na)
      ) : (
        <>
          {formatValue(value, 3)} {creditToken.toUpperCase()}
        </>
      ),
    [creditToken, t],
  );

  const newCollateralRenderer = useCallback(
    (value: number) =>
      value === 0 ? (
        t(translations.common.na)
      ) : (
        <>{formatValue(value, 3)} RBTC</>
      ),
    [t],
  );

  const initialLiquidationPrice = useMemo(
    () => 1.1 * (Number(creditValue) / Number(collateralValue)),
    [creditValue, collateralValue],
  );
  const initialLiquidationPriceRecoveryMode = useMemo(
    () => 1.5 * (Number(creditValue) / Number(collateralValue)),
    [creditValue, collateralValue],
  );

  const liquidationPrice = useMemo(
    () => 1.1 * (newDebt / newCollateral),
    [newDebt, newCollateral],
  );
  const liquidationPriceRecoveryMode = useMemo(
    () => 1.5 * (newDebt / newCollateral),
    [newDebt, newCollateral],
  );

  const hasTrove = useMemo(
    () => collateralValue !== '0' && creditValue !== '0',
    [collateralValue, creditValue],
  );

  return (
    <div className="w-full">
      {hasTrove && (
        <CurrentTroveData
          className="sm:hidden"
          creditValue={creditValue}
          collateralValue={collateralValue}
          rbtcPrice={rbtcPrice || '0'}
        />
      )}

      <FormGroup
        label={
          <Label
            symbol={creditToken}
            maxAmount={maxCreditAmount}
            tabs={debtTabs}
            activeTab={debtType}
            onTabChange={setDebtType}
            onMaxAmountClicked={handleMaxCreditAmountClick}
          />
        }
        className="w-full"
      >
        <div className="w-full flex flex-row justify-between items-center gap-3">
          <AmountInput
            value={creditAmount}
            onChange={handleCreditAmountChange}
            maxAmount={maxCreditAmount}
            label={t(translations.adjustCreditLine.fields.debt.amount)}
            tooltip={t(translations.adjustCreditLine.fields.debt.tooltip)}
            className="w-full flex-grow-0 flex-shrink"
          />
          <Select
            value={creditToken}
            onChange={setCreditToken}
            options={tokens}
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
            maxAmount={maxCollateralAmount}
            tabs={collateralTabs}
            activeTab={collateralType}
            onTabChange={setCollateralType}
            onMaxAmountClicked={handleMaxCollateralAmountClick}
          />
        }
        className="max-w-none mt-8"
      >
        <AmountInput
          value={collateralAmount}
          onChange={handleCollateralAmountChange}
          maxAmount={maxCollateralAmount}
          label={t(translations.adjustCreditLine.fields.collateral.amount)}
          tooltip={t(translations.adjustCreditLine.fields.collateral.tooltip)}
          className="max-w-none"
          unit="RBTC"
        />
      </FormGroup>
      <div className="my-6">
        <SimpleTable>
          <Row
            label={t(translations.adjustCreditLine.labels.newDebt)}
            tooltip={t(translations.adjustCreditLine.labels.newDebtTooltip)}
            value={
              <DynamicValue
                initialValue={Number(creditValue)}
                value={newDebt}
                renderer={newDebtRenderer}
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
                initialValue={Number(collateralValue)}
                value={newCollateral}
                renderer={newCollateralRenderer}
              />
            }
          />
        </SimpleTable>
      </div>

      <div className="flex flex-row justify-between items-center mb-3">
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
            initialValue={initialRatio}
            value={ratio}
            renderer={value => <>{formatValue(value, 3)}%</>}
          />
        </div>
      </div>
      <HealthBar
        start={CR_THRESHOLDS.start}
        middleStart={CR_THRESHOLDS.middleStart}
        middleEnd={CR_THRESHOLDS.middleEnd}
        end={CR_THRESHOLDS.end}
        value={ratio}
      />

      <div className="mt-6">
        <SimpleTable>
          <Row
            label={t(translations.adjustCreditLine.labels.liquidationPrice)}
            tooltip={t(
              translations.adjustCreditLine.labels.liquidationPriceTooltip,
            )}
            value={
              <DynamicValue
                initialValue={initialLiquidationPrice}
                value={liquidationPrice}
                renderer={value => <>{formatValue(value, 3)} USD</>}
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
                initialValue={initialLiquidationPriceRecoveryMode}
                value={liquidationPriceRecoveryMode}
                renderer={value => <>{formatValue(value, 3)} USD</>}
              />
            }
            valueClassName="text-primary-10"
          />
          <Row
            label={t(translations.adjustCreditLine.labels.rbtcPrice)}
            tooltip={t(translations.adjustCreditLine.labels.rbtcPriceTooltip)}
            value={<>{formatValue(Number(rbtcPrice), 3)} USD</>}
          />
          <Row
            label={t(translations.adjustCreditLine.labels.originationFee)}
            tooltip={t(
              translations.adjustCreditLine.labels.originationFeeTooltip,
            )}
            value={
              <>{formatValue(Number(fees?.borrowingRate().mul(100)), 1)}%</>
            }
          />
        </SimpleTable>
      </div>
      <div className="mt-8 flex flex-row items-center justify-between gap-8">
        <Button
          type={ButtonType.reset}
          style={ButtonStyle.primary}
          text={t(translations.common.buttons.confirm)}
          className="w-full"
          onClick={handleFormSubmit}
        />
      </div>
    </div>
  );
};
