import React, { ChangeEvent, useCallback, useMemo, useState, FC } from 'react';

import { commify } from 'ethers/lib/utils';

import {
  AmountInput,
  Button,
  ButtonStyle,
  ButtonType,
  FormGroup,
  HealthBar,
  Select,
  SelectOption,
  SimpleTable,
} from '@sovryn/ui';

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
  const maxCollateralAmount = 10000;
  const maxCreditAmount = 5000;

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
                label: 'Borrow',
              },
              {
                value: AmountType.Remove,
                label: 'Repay',
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
            label="Amount"
            tooltip="Amount of debt to add or remove"
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
                label: 'Add collateral',
              },
              {
                value: AmountType.Remove,
                label: 'Withdraw collateral',
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
          label="Amount"
          tooltip="Amount of collateral to add or remove"
          className="max-w-none"
          unit="RBTC"
        />
      </FormGroup>
      <div className="my-6">
        <SimpleTable>
          <Row
            label="New debt"
            tooltip="This is a tooltip"
            value={
              <>
                {newDebt.toFixed(3)} {creditToken}
              </>
            }
            valueClassName="text-primary-10"
          />
          <Row
            label="New collateral"
            tooltip="This is a tooltip"
            value={<>{newCollateral.toFixed(3)} RBTC</>}
          />
        </SimpleTable>
      </div>

      <div className="flex flex-row justify-between items-center mb-3">
        <div>Collateral ratio</div>
        <div className="text-primary-10">{ratio}%</div>
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
            label="Liquidation price"
            tooltip="This is a tooltip"
            value={<>{commify(15023)} USD</>}
            valueClassName="text-primary-10"
          />
          <Row
            label="Liquidation price (Recovery Mode)"
            tooltip="This is a tooltip"
            value={<>{commify(17653)} USD</>}
            valueClassName="text-primary-10"
          />
          <Row
            label="RBTC Price"
            tooltip="This is a tooltip"
            value={<>{commify(20000)} USD</>}
          />
          <Row
            label="Origination Fee"
            tooltip="This is a tooltip"
            value={<>{commify(0.5)}%</>}
          />
        </SimpleTable>
      </div>
      <div className="mt-8 flex flex-row items-center justify-between gap-8">
        <Button
          type={ButtonType.reset}
          style={ButtonStyle.primary}
          text="Confirm"
          className="w-full"
          onClick={handleFormSubmit}
        />
      </div>
    </div>
  );
};
