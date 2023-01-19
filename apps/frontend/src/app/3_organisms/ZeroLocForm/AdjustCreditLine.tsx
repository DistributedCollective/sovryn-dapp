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
import { BORROW_ASSETS } from '../../5_pages/ZeroPage/constants';
import { useAssetBalance } from '../../../hooks/useAssetBalance';
import { translations } from '../../../locales/i18n';
import { CR_THRESHOLDS } from '../../../utils/constants';
import { formatValue, fromWei } from '../../../utils/math';
import { tokensToOptions } from '../../../utils/tokens';
import { CurrentTroveData } from './CurrentTroveData';
import { Label } from './Label';
import { Row } from './Row';
import {
  CRITICAL_COLLATERAL_RATIO,
  MINIMUM_COLLATERAL_RATIO,
} from './constants';
import {
  AdjustCreditLineProps,
  AmountType,
  CreditLineSubmitValue,
  CreditLineType,
} from './types';
import { normalizeAmountByType } from './utils';

export const AdjustCreditLine: FC<AdjustCreditLineProps> = ({
  type,
  existingCollateral,
  existingDebt,
  onSubmit,
  rbtcPrice,
  fees,
}) => {
  const [debtType, setDebtType] = useState(AmountType.Add);
  const [collateralType, setCollateralType] = useState(AmountType.Add);

  const [collateralAmount, setCollateralAmount] = useState('0');
  const [debtAmount, setDebtAmount] = useState('0');
  const [debtToken, setDebtToken] = useState<SupportedTokens>(
    SupportedTokens.zusd,
  );

  const { value: creditWeiBalance } = useAssetBalance(debtToken);

  const { value: maxCollateralWeiAmount } = useAssetBalance(
    SupportedTokens.rbtc,
  );

  const isIncreasingDebt = useMemo(
    () => debtType === AmountType.Add,
    [debtType],
  );

  const isIncreasingCollateral = useMemo(
    () => collateralType === AmountType.Add,
    [collateralType],
  );

  const newDebt = useMemo(
    () =>
      Number(existingDebt) +
      normalizeAmountByType(Number(debtAmount), debtType),
    [debtAmount, existingDebt, debtType],
  );
  const newCollateral = useMemo(
    () =>
      Number(existingCollateral) +
      normalizeAmountByType(Number(collateralAmount), collateralType),
    [collateralAmount, collateralType, existingCollateral],
  );

  const maxCollateralAmount = useMemo(
    () =>
      Number(
        isIncreasingCollateral
          ? fromWei(maxCollateralWeiAmount)
          : existingCollateral,
      ),
    [existingCollateral, isIncreasingCollateral, maxCollateralWeiAmount],
  );

  const maxCreditAmount = useMemo(() => {
    return Number(
      isIncreasingDebt
        ? (maxCollateralAmount * Number(rbtcPrice || '0')) /
            MINIMUM_COLLATERAL_RATIO
        : Math.min(Number(fromWei(creditWeiBalance)), Number(existingDebt)),
    );
  }, [
    isIncreasingDebt,
    maxCollateralAmount,
    rbtcPrice,
    creditWeiBalance,
    existingDebt,
  ]);

  const handleMaxCollateralAmountClick = useCallback(
    () => setCollateralAmount(String(maxCollateralAmount)),
    [maxCollateralAmount],
  );

  const handleMaxCreditAmountClick = useCallback(
    () => setDebtAmount(String(maxCreditAmount)),
    [maxCreditAmount],
  );

  const handleCollateralAmountChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) =>
      setCollateralAmount(event.currentTarget.value),
    [],
  );

  const handleCreditAmountChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) =>
      setDebtAmount(event.currentTarget.value),
    [],
  );

  const handleFormSubmit = useCallback(() => {
    let value: Partial<CreditLineSubmitValue> = {};

    value[isIncreasingCollateral ? 'depositCollateral' : 'withdrawCollateral'] =
      collateralAmount;
    value[isIncreasingDebt ? 'borrow' : 'repay'] = debtAmount;

    onSubmit(value as CreditLineSubmitValue);
  }, [
    collateralAmount,
    debtAmount,
    isIncreasingCollateral,
    isIncreasingDebt,
    onSubmit,
  ]);

  const initialRatio = useMemo(() => {
    if ([existingCollateral, existingDebt, rbtcPrice].some(v => !v)) {
      return 0;
    }
    return (
      ((Number(existingCollateral) * Number(rbtcPrice)) /
        Number(existingDebt)) *
      100
    );
  }, [existingCollateral, existingDebt, rbtcPrice]);

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
        disabled: type === CreditLineType.Open,
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
        disabled: type === CreditLineType.Open,
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
          {formatValue(value, 3)} {debtToken.toUpperCase()}
        </>
      ),
    [debtToken, t],
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
    () =>
      MINIMUM_COLLATERAL_RATIO *
      (Number(existingDebt) / Number(existingCollateral)),
    [existingDebt, existingCollateral],
  );
  const initialLiquidationPriceRecoveryMode = useMemo(
    () =>
      CRITICAL_COLLATERAL_RATIO *
      (Number(existingDebt) / Number(existingCollateral)),
    [existingCollateral, existingDebt],
  );

  const liquidationPrice = useMemo(
    () => MINIMUM_COLLATERAL_RATIO * (newDebt / newCollateral),
    [newDebt, newCollateral],
  );
  const liquidationPriceRecoveryMode = useMemo(
    () => CRITICAL_COLLATERAL_RATIO * (newDebt / newCollateral),
    [newDebt, newCollateral],
  );

  const hasTrove = useMemo(
    () => existingCollateral !== '0' && existingDebt !== '0',
    [existingCollateral, existingDebt],
  );

  return (
    <div className="w-full">
      {hasTrove && (
        <CurrentTroveData
          debt={existingDebt}
          collateral={existingCollateral}
          rbtcPrice={rbtcPrice || '0'}
        />
      )}

      <FormGroup
        label={
          <Label
            symbol={debtToken}
            maxAmount={maxCreditAmount}
            tabs={debtTabs}
            activeTab={debtType}
            onTabChange={setDebtType}
            onMaxAmountClicked={handleMaxCreditAmountClick}
          />
        }
        className="w-full"
        dataAttribute="adjust-credit-line-credit-amount"
      >
        <div className="w-full flex flex-row justify-between items-center gap-3">
          <AmountInput
            value={debtAmount}
            onChange={handleCreditAmountChange}
            maxAmount={maxCreditAmount}
            label={t(translations.adjustCreditLine.fields.debt.amount)}
            tooltip={t(translations.adjustCreditLine.fields.debt.tooltip)}
            className="w-full flex-grow-0 flex-shrink"
          />
          <Select
            value={debtToken}
            onChange={setDebtToken}
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
            maxAmount={maxCollateralAmount}
            tabs={collateralTabs}
            activeTab={collateralType}
            onTabChange={setCollateralType}
            onMaxAmountClicked={handleMaxCollateralAmountClick}
          />
        }
        className="max-w-none mt-8"
        dataAttribute="adjust-credit-line-collateral-amount"
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
                initialValue={Number(existingDebt)}
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
                initialValue={Number(existingDebt)}
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
          dataAttribute="adjust-credit-line-confirm-button"
        />
      </div>
    </div>
  );
};
