import React, { FC, useCallback, useMemo } from 'react';

import { t } from 'i18next';

import {
  AmountInput,
  Button,
  FormGroup,
  SimpleTable,
  SimpleTableRow,
} from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { AssetRenderer } from '../../../../2_molecules/AssetRenderer/AssetRenderer';
import { MaxButton } from '../../../../2_molecules/MaxButton/MaxButton';
import { useWeiAmountInput } from '../../../../../hooks/useWeiAmountInput';
import { translations } from '../../../../../locales/i18n';
import { FullAdjustModalState } from './AdjustLendingModalContainer';

export type WithdrawProps = {
  state: FullAdjustModalState;
  onConfirm: (amount: Decimal) => void;
};

export const Withdraw: FC<WithdrawProps> = ({ state, onConfirm }) => {
  const [value, setValue, amount] = useWeiAmountInput('');

  const handleSubmit = useCallback(
    () => onConfirm(Decimal.fromBigNumberString(amount.toString())),
    [amount, onConfirm],
  );

  const handleMaxClick = useCallback(
    () => setValue(state.balance.toString()),
    [state.balance, setValue],
  );

  const newBalance = useMemo(() => {
    const balance = state.balance.sub(
      Decimal.fromBigNumberString(amount.toString()),
    );
    return balance.lt(0) ? Decimal.ZERO : balance;
  }, [amount, state.balance]);

  const canSubmit = useMemo(
    () => amount.gt(0) && amount.lte(state.balance.toBigNumber()),
    [amount, state.balance],
  );

  return (
    <>
      <FormGroup
        label={
          <div className="w-full flex justify-end">
            <MaxButton
              value={state.balance}
              token={state.token}
              onClick={handleMaxClick}
            />
          </div>
        }
        labelElement="div"
        className="max-w-none mt-8"
        dataAttribute="adjust-lending-deposit-amount"
      >
        <AmountInput
          value={value}
          onChangeText={setValue}
          maxAmount={state.balance.toNumber()}
          label={t(translations.common.amount)}
          className="max-w-none"
          unit={<AssetRenderer asset={state.tokenDetails.symbol} />}
          // invalid={!!props.collateralError}
          placeholder="0"
        />
      </FormGroup>

      <SimpleTable className="mt-8">
        <SimpleTableRow
          label={t(translations.lendingAdjust.apy)}
          value={<AmountRenderer value={state.apy} suffix="% APY" />}
        />
        <SimpleTableRow
          label={t(translations.lendingAdjust.currentBalance)}
          value={
            <AmountRenderer
              value={state.balance}
              suffix={state.tokenDetails.symbol}
            />
          }
        />
        <SimpleTableRow
          label={t(translations.lendingAdjust.newBalance)}
          value={
            <AmountRenderer
              value={newBalance}
              suffix={state.tokenDetails.symbol}
            />
          }
        />
      </SimpleTable>

      <Button
        text={t(translations.common.buttons.confirm)}
        disabled={!canSubmit}
        onClick={handleSubmit}
        className="mt-8 w-full"
      />
    </>
  );
};
