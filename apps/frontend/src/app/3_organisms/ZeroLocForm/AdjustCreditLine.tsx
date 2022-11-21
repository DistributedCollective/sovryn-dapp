import React, { ChangeEvent, useCallback, useMemo, useState, FC } from 'react';

import {
  AmountInput,
  Button,
  ButtonStyle,
  ButtonType,
  FormGroup,
  Select,
  SelectOption,
} from '@sovryn/ui';

import { CustomLabel } from './CustomLabel';

type AdjustCreditLineProps = {
  collateralValue: string;
  creditValue: string;
  onCollateralChange: (value: string) => void;
  onCreditChange: (value: string) => void;
  onSubmit: () => void;
};

export const AdjustCreditLine: FC<AdjustCreditLineProps> = ({
  collateralValue,
  creditValue,
  onCollateralChange,
  onCreditChange,
  onSubmit,
}) => {
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
    () => onCollateralChange(String(maxCollateralAmount)),
    [maxCollateralAmount, onCollateralChange],
  );

  const handleIncreaseCollateralAmountClick = useCallback(
    () =>
      onCollateralChange(
        String(
          Math.min(
            Number(collateralValue) + Number(collateralAmount),
            maxCollateralAmount,
          ),
        ),
      ),
    [
      collateralAmount,
      collateralValue,
      maxCollateralAmount,
      onCollateralChange,
    ],
  );

  const handleDecreaseCollateralAmountClick = useCallback(
    () =>
      onCollateralChange(
        String(Math.max(Number(collateralValue) - Number(collateralAmount), 0)),
      ),
    [collateralAmount, collateralValue, onCollateralChange],
  );

  const handleMaxCreditAmountClick = useCallback(
    () => onCreditChange(String(maxCreditAmount)),
    [maxCreditAmount, onCreditChange],
  );

  const handleIncreaseCreditAmountClick = useCallback(
    () =>
      onCreditChange(
        String(
          Math.min(Number(creditValue) + Number(creditAmount), maxCreditAmount),
        ),
      ),
    [creditAmount, creditValue, maxCreditAmount, onCreditChange],
  );

  const handleDecreaseCreditAmountClick = useCallback(
    () =>
      onCreditChange(
        String(Math.max(Number(creditValue) - Number(creditAmount), 0)),
      ),
    [creditAmount, creditValue, onCreditChange],
  );

  const increaseCollateralAmountDisabled = useMemo(
    () =>
      Number(collateralAmount) + Number(collateralValue) >
        maxCollateralAmount || collateralAmount === '0',
    [collateralAmount, collateralValue, maxCollateralAmount],
  );

  const decreaseCollateralAmountDisabled = useMemo(
    () =>
      Number(collateralValue) - Number(collateralAmount) < 0 ||
      collateralAmount === '0',
    [collateralAmount, collateralValue],
  );

  const increaseCreditAmountDisabled = useMemo(
    () =>
      Number(creditAmount) + Number(creditValue) > maxCreditAmount ||
      creditAmount === '0',
    [creditAmount, creditValue, maxCreditAmount],
  );

  const decreaseCreditAmountDisabled = useMemo(
    () =>
      Number(creditValue) - Number(creditAmount) < 0 || creditAmount === '0',
    [creditAmount, creditValue],
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

  const handleResetClick = useCallback(() => {
    setCollateralAmount('0');
    setCreditAmount('0');
    onCollateralChange('0');
    onCreditChange('0');
  }, [onCollateralChange, onCreditChange]);

  return (
    <div className="w-full">
      <FormGroup
        label={
          <CustomLabel
            title="Collateral"
            symbol="RBTC"
            maxAmount={maxCollateralAmount}
            disableIncrease={increaseCollateralAmountDisabled}
            disableDecrease={decreaseCollateralAmountDisabled}
            onMaxAmountClicked={handleMaxCollateralAmountClick}
            onIncreaseClicked={handleIncreaseCollateralAmountClick}
            onDecreaseClicked={handleDecreaseCollateralAmountClick}
          />
        }
        className="max-w-none"
      >
        <AmountInput
          value={collateralAmount}
          onChange={handleCollateralAmountChange}
          label="Amount"
          tooltip="Amount of collateral to add or remove"
          className="max-w-none"
        />
      </FormGroup>
      <FormGroup
        label={
          <CustomLabel
            title="Debt"
            symbol={creditToken}
            maxAmount={maxCreditAmount}
            disableIncrease={increaseCreditAmountDisabled}
            disableDecrease={decreaseCreditAmountDisabled}
            onMaxAmountClicked={handleMaxCreditAmountClick}
            onIncreaseClicked={handleIncreaseCreditAmountClick}
            onDecreaseClicked={handleDecreaseCreditAmountClick}
          />
        }
        className="mt-8 w-full"
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
      <div className="mt-8 flex flex-row items-center justify-between gap-8">
        <Button
          type={ButtonType.reset}
          style={ButtonStyle.secondary}
          text="Cancel"
          className="w-full"
          onClick={handleResetClick}
        />
        <Button
          type={ButtonType.reset}
          style={ButtonStyle.primary}
          text="Confirm"
          className="w-full"
          onClick={onSubmit}
        />
      </div>
    </div>
  );
};
