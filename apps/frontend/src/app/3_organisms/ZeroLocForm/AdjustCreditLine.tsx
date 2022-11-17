import React, { useCallback, useMemo, useState } from 'react';
import { FC } from 'react';

import { AmountInput, FormGroup, Select, SelectOption } from '@sovryn/ui';

import { CustomLabel } from './CustomLabel';

type AdjustCreditLineProps = {
  collateralValue: string;
  creditValue: string;
  onCollateralChange: (value: string) => void;
  onCreditChange: (value: string) => void;
};

export const AdjustCreditLine: FC<AdjustCreditLineProps> = ({
  collateralValue,
  creditValue,
  onCollateralChange,
  onCreditChange,
}) => {
  const [collateralAmount, setCollateralAmount] = useState('0');
  const [creditAmount, setCreditAmount] = useState('0');
  const [creditToken, setCreditToken] = useState('DLLR');

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

  // todo
  const maxCollateralAmount = useMemo(() => 100000, []);

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

  // todo
  const maxCreditAmount = useMemo(() => 100000, []);

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

  return (
    <>
      {collateralAmount} | {collateralValue} | {maxCollateralAmount}
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
      >
        <AmountInput
          value={collateralAmount}
          onChange={e => setCollateralAmount(e.target.value)}
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
        className="mt-8"
      >
        <div className="flex flex-row justify-between items-center gap-3">
          <AmountInput
            value={creditAmount}
            onChange={e => setCreditAmount(e.target.value)}
          />
          <Select
            value={creditToken}
            onChange={setCreditToken}
            options={tokens}
          />
        </div>
      </FormGroup>
    </>
  );
};
