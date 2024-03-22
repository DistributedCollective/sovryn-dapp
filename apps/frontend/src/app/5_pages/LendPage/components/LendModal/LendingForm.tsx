import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { t } from 'i18next';

import {
  AmountInput,
  Button,
  Checkbox,
  FormGroup,
  SimpleTable,
  SimpleTableRow,
  ErrorBadge,
  ErrorLevel,
} from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { RSK_CHAIN_ID } from '../../../../../config/chains';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { AssetRenderer } from '../../../../2_molecules/AssetRenderer/AssetRenderer';
import { MaxButton } from '../../../../2_molecules/MaxButton/MaxButton';
import { GAS_LIMIT } from '../../../../../constants/gasLimits';
import { useMaintenance } from '../../../../../hooks/useMaintenance';
import { useMaxAssetBalance } from '../../../../../hooks/useMaxAssetBalance';
import { useWeiAmountInput } from '../../../../../hooks/useWeiAmountInput';
import { translations } from '../../../../../locales/i18n';
import { asyncCall } from '../../../../../store/rxjs/provider-cache';
import { FullLendingModalState } from './LendingModalContainer';

export type DepositProps = {
  state: FullLendingModalState;
  onConfirm: (amount: Decimal) => void;
};

export const LendingForm: FC<DepositProps> = ({ state, onConfirm }) => {
  const [value, setValue, amount] = useWeiAmountInput('');

  const { checkMaintenance, States } = useMaintenance();
  const depositLocked = checkMaintenance(States.DEPOSIT_LEND);

  const { balance } = useMaxAssetBalance(
    state.token,
    RSK_CHAIN_ID,
    GAS_LIMIT.LENDING_MINT,
  );

  const [hasDisclaimerBeenChecked, setHasDisclaimerBeenChecked] =
    useState(false);

  const handleSubmit = useCallback(
    () => onConfirm(Decimal.fromBigNumberString(amount.toString())),
    [amount, onConfirm],
  );

  const handleMaxClick = useCallback(
    () => setValue(balance.toString()),
    [balance, setValue],
  );

  const isValidAmount = useMemo(
    () => amount.gt(0) && amount.lte(balance.toBigNumber()),
    [amount, balance],
  );

  const isSubmitDisabled = useMemo(
    () => !isValidAmount || !hasDisclaimerBeenChecked || depositLocked,
    [isValidAmount, hasDisclaimerBeenChecked, depositLocked],
  );

  const [lendApr, setLendApr] = useState<Decimal>(state.apr);

  useEffect(() => {
    asyncCall(
      `lending/${state.poolTokenContract.address}/nextSupplyInterestRate/${amount}`,
      () => state.poolTokenContract.nextSupplyInterestRate(amount),
    ).then(res => setLendApr(Decimal.fromBigNumberString(res.toString())));
  }, [state.poolTokenContract, amount]);

  useEffect(() => setValue(''), [setValue]);

  return (
    <>
      <FormGroup
        label={
          <div className="flex justify-end w-full">
            <MaxButton
              value={balance}
              token={state.token}
              onClick={handleMaxClick}
            />
          </div>
        }
        labelElement="div"
        className="max-w-none mt-6"
        dataAttribute="adjust-lending-deposit-amount"
      >
        <AmountInput
          value={value}
          onChangeText={setValue}
          maxAmount={balance.toNumber()}
          label={t(translations.common.amount)}
          className="max-w-none"
          unit={<AssetRenderer asset={state.tokenDetails.symbol} />}
          placeholder="0"
        />
      </FormGroup>
      {!isValidAmount && !amount.eq(0) && (
        <ErrorBadge
          level={ErrorLevel.Critical}
          message={t(translations.lending.form.invalidAmountError)}
          dataAttribute="adjust-lending-deposit-amount-error"
        />
      )}
      <SimpleTable className="mt-6">
        <SimpleTableRow
          label={t(translations.lending.newApr)}
          value={
            <AmountRenderer
              value={lendApr}
              suffix={`% ${t(translations.lendPage.apr)}`}
            />
          }
        />
      </SimpleTable>

      <div className="mt-6">
        <Checkbox
          checked={hasDisclaimerBeenChecked}
          onChangeValue={setHasDisclaimerBeenChecked}
          label={t(translations.lending.disclaimer)}
        />
      </div>

      <Button
        text={t(translations.common.buttons.confirm)}
        disabled={isSubmitDisabled}
        onClick={handleSubmit}
        className="mt-6 w-full"
      />
      {depositLocked && (
        <ErrorBadge
          level={ErrorLevel.Warning}
          message={t(translations.maintenanceMode.featureDisabled)}
        />
      )}
    </>
  );
};
