import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { BigNumber } from 'ethers';
import { t } from 'i18next';

import {
  AmountInput,
  Button,
  ErrorBadge,
  ErrorLevel,
  FormGroup,
  SimpleTable,
  SimpleTableRow,
} from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { RSK_CHAIN_ID } from '../../../../../config/chains';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { AssetRenderer } from '../../../../2_molecules/AssetRenderer/AssetRenderer';
import { GAS_LIMIT } from '../../../../../constants/gasLimits';
import { getTokenDisplayName } from '../../../../../constants/tokens';
import { useMaxAssetBalance } from '../../../../../hooks/useMaxAssetBalance';
import { useWeiAmountInput } from '../../../../../hooks/useWeiAmountInput';
import { translations } from '../../../../../locales/i18n';
import { asyncCall } from '../../../../../store/rxjs/provider-cache';
import { FullAdjustModalState } from './AdjustLendingModalContainer';
import { Label } from './Label';

export enum FormType {
  Deposit = 'deposit',
  Withdraw = 'withdraw',
}

export type DepositProps = {
  state: FullAdjustModalState;
  onConfirm: (type: FormType, amount: Decimal) => void;
};

export const LendingForm: FC<DepositProps> = ({ state, onConfirm }) => {
  const [type, setType] = useState<FormType>(FormType.Deposit);
  const [value, setValue, amount] = useWeiAmountInput('');

  const isDeposit = useMemo(() => type === FormType.Deposit, [type]);

  const { balance: userBalance } = useMaxAssetBalance(
    state.token,
    RSK_CHAIN_ID,
    GAS_LIMIT.LENDING_MINT,
  );

  const balance = useMemo(
    () =>
      isDeposit ? userBalance : Decimal.min(state.balance, state.liquidity),
    [isDeposit, state.balance, state.liquidity, userBalance],
  );

  const handleSubmit = useCallback(
    () => onConfirm(type, Decimal.fromBigNumberString(amount.toString())),
    [type, amount, onConfirm],
  );

  const handleMaxClick = useCallback(
    () => setValue(balance.toString()),
    [balance, setValue],
  );

  const newBalance = useMemo(() => {
    if (isDeposit) {
      return state.balance.add(Decimal.fromBigNumberString(amount.toString()));
    } else {
      const bal = state.balance.sub(
        Decimal.fromBigNumberString(amount.toString()),
      );
      return bal.lt(0) ? Decimal.ZERO : bal;
    }
  }, [amount, isDeposit, state.balance]);

  const amountIsValid = useMemo(() => {
    if (isDeposit) {
      return amount.gt(0) && amount.lte(balance.toBigNumber());
    } else {
      return amount.gt(0) && state.balance.toBigNumber().gte(amount);
    }
  }, [amount, balance, isDeposit, state.balance]);

  const [totalSupply, setTotalSupply] = useState<BigNumber>(BigNumber.from(0));
  const [lendApr, setLendApr] = useState<Decimal>(state.apr);
  const [withdrawApr, setWithdrawApr] = useState<Decimal>(state.apr);

  useEffect(() => {
    asyncCall(
      `lending/${state.poolTokenContract.address}/totalAssetSupply`,
      () => state.poolTokenContract.totalAssetSupply(),
    ).then(setTotalSupply);
  }, [state.poolTokenContract]);

  useEffect(() => {
    if (isDeposit) {
      asyncCall(
        `lending/${state.poolTokenContract.address}/nextSupplyInterestRate/${amount}`,
        () => state.poolTokenContract.nextSupplyInterestRate(amount),
      ).then(res => setLendApr(Decimal.fromBigNumberString(res.toString())));
    }
  }, [state.poolTokenContract, amount, type, isDeposit]);

  useEffect(() => {
    if (!isDeposit) {
      asyncCall(
        `lending/${
          state.poolTokenContract.address
        }/totalSupplyInterestRate/${totalSupply.toHexString()}/${amount}`,
        () =>
          state.poolTokenContract.totalSupplyInterestRate(
            totalSupply.sub(amount),
          ),
      ).then(res =>
        setWithdrawApr(Decimal.fromBigNumberString(res.toString())),
      );
    }
  }, [amount, isDeposit, state.poolTokenContract, totalSupply]);

  const newApr = useMemo(
    () => (isDeposit ? lendApr : withdrawApr),
    [isDeposit, lendApr, withdrawApr],
  );

  // reset value when tab changed
  useEffect(() => setValue(''), [setValue, type]);

  return (
    <>
      <FormGroup
        label={
          <Label
            tab={type}
            onTabChanged={setType}
            token={state.token}
            balance={balance}
            onMaxClicked={handleMaxClick}
          />
        }
        labelElement="div"
        className="max-w-none mt-8"
        dataAttribute="adjust-lending-deposit-amount"
      >
        <AmountInput
          value={value}
          onChangeText={setValue}
          maxAmount={balance.toNumber()}
          label={t(translations.common.amount)}
          className="max-w-none"
          unit={<AssetRenderer asset={state.tokenDetails.symbol} />}
          // invalid={!!props.collateralError}
          placeholder="0"
        />
      </FormGroup>
      {!amountIsValid && amount.gt(0) && (
        <ErrorBadge
          level={ErrorLevel.Critical}
          message={t(translations.lending.form.invalidAmountError)}
          dataAttribute="adjust-lending-amount-error"
        />
      )}
      <SimpleTable className="mt-8">
        <SimpleTableRow
          label={t(translations.lendingAdjust.newApr)}
          value={
            <AmountRenderer
              value={newApr}
              suffix={`% ${t(translations.lendPage.apr)}`}
            />
          }
        />
        <SimpleTableRow
          label={t(translations.lendingAdjust.newBalance)}
          value={
            <AmountRenderer
              value={newBalance}
              suffix={getTokenDisplayName(state.tokenDetails.symbol)}
            />
          }
        />
      </SimpleTable>

      <Button
        text={t(translations.common.buttons.confirm)}
        disabled={!amountIsValid}
        onClick={handleSubmit}
        className="mt-8 w-full"
      />
    </>
  );
};
