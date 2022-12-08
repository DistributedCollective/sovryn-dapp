import React, { ChangeEvent, useCallback, useMemo, useState, FC } from 'react';

import { commify } from 'ethers/lib/utils';
import { useTranslation } from 'react-i18next';

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
  SelectOption,
  SimpleTable,
} from '@sovryn/ui';

import { translations } from '../../../locales/i18n';
import { Label } from './CustomLabel';
import { Row } from './SimpleTableRow';
import { AmountType } from './types';
import { normalizeAmountByType } from './utils';

type SubmitValue = {
  debt: string;
  collateral: string;
};

type AdjustCreditLineProps = {
  collateralValue: string;
  creditValue: string;
  onSubmit: (value: SubmitValue) => void;
};

export const AdjustCreditLine: FC<AdjustCreditLineProps> = ({
  collateralValue,
  creditValue,
  onSubmit,
}) => {
  const [debtType, setDebtType] = useState(AmountType.Add);
  const [collateralType, setCollateralType] = useState(AmountType.Add);

  const [collateralAmount, setCollateralAmount] = useState('0');
  const [creditAmount, setCreditAmount] = useState('0');
  const [creditToken, setCreditToken] = useState('DLLR');

  // todo: these needs to be retrieved
  const maxCollateralAmount = 1;
  const maxCreditAmount = 100;

  const tokens = useMemo(
    () =>
      [
        {
          label: 'DLLR',
          value: 'DLLR',
        },
        {
          label: 'ZUSD',
          value: 'ZUSD',
        },
        {
          label: 'XUSD',
          value: 'XUSD',
        },
        {
          label: 'SOV',
          value: 'SOV',
        },
      ] as SelectOption[],
    [],
  );

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

  const handleFormSubmit = useCallback(() => {
    onSubmit({
      debt: String(newDebt),
      collateral: String(newCollateral),
    });
  }, [newCollateral, newDebt, onSubmit]);

  // todo: convert collateral and debt to same asset before calculating actual ratio
  const ratio = useMemo(() => {
    if (newDebt === 0) {
      return 0;
    }
    return (newCollateral / newDebt) * 100;
  }, [newCollateral, newDebt]);

  const { t } = useTranslation();

  return (
    <div className="w-full">
      <FormGroup
        label={
          <Label
            symbol={creditToken}
            maxAmount={maxCreditAmount}
            tabs={[
              {
                value: AmountType.Add,
                label: t(translations.adjustCreditLine.actions.borrow),
              },
              {
                value: AmountType.Remove,
                label: t(translations.adjustCreditLine.actions.repay),
              },
            ]}
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
            label={t(translations.adjustCreditLine.fields.debt.amount)}
            tooltip={t(translations.adjustCreditLine.fields.debt.tooltip)}
            className="w-full flex-grow-0 flex-shrink"
          />
          <Select
            value={creditToken}
            onChange={setCreditToken}
            options={tokens}
          />
        </div>
      </FormGroup>
      <FormGroup
        label={
          <Label
            symbol="RBTC"
            maxAmount={maxCollateralAmount}
            tabs={[
              {
                value: AmountType.Add,
                label: t(translations.adjustCreditLine.actions.addCollateral),
              },
              {
                value: AmountType.Remove,
                label: t(
                  translations.adjustCreditLine.actions.withdrawCollateral,
                ),
              },
            ]}
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
                renderer={value => (
                  <>
                    {value.toFixed(3)} {creditToken}
                  </>
                )}
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
                renderer={value => <>{value.toFixed(3)} RBTC</>}
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
            initialValue={0 /* todo: calculate initial ratio once possible */}
            value={ratio}
            renderer={value => <>{value}%</>}
          />
        </div>
      </div>
      <HealthBar
        start={70}
        middleStart={110}
        middleEnd={150}
        end={200}
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
                initialValue={0}
                value={15023}
                renderer={value => <>{commify(value)} USD</>}
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
                initialValue={0}
                value={17653}
                renderer={value => <>{commify(value)} USD</>}
              />
            }
            valueClassName="text-primary-10"
          />
          <Row
            label={t(translations.adjustCreditLine.labels.rbtcPrice)}
            tooltip={t(translations.adjustCreditLine.labels.rbtcPriceTooltip)}
            value={<>{commify(20000)} USD</>}
          />
          <Row
            label={t(translations.adjustCreditLine.labels.originationFee)}
            tooltip={t(
              translations.adjustCreditLine.labels.originationFeeTooltip,
            )}
            value={<>{commify(0.5)}%</>}
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
