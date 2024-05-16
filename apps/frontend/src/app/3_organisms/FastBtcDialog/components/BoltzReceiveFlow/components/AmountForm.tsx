import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { t } from 'i18next';

import { SupportedTokens } from '@sovryn/contracts';
import {
  AmountInput,
  Button,
  ButtonStyle,
  ErrorBadge,
  ErrorLevel,
  Heading,
  HeadingType,
  Paragraph,
  ParagraphSize,
} from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { defaultChainId } from '../../../../../../config/chains';

import { MaxButton } from '../../../../../2_molecules/MaxButton/MaxButton';
import {
  BITCOIN,
  BTC_RENDER_PRECISION,
} from '../../../../../../constants/currencies';
import { GAS_LIMIT } from '../../../../../../constants/gasLimits';
import { BTC_IN_SATOSHIS } from '../../../../../../constants/general';
import { useMaintenance } from '../../../../../../hooks/useMaintenance';
import { useMaxAssetBalance } from '../../../../../../hooks/useMaxAssetBalance';
import { translations } from '../../../../../../locales/i18n';
import { decimalic } from '../../../../../../utils/math';
import {
  DepositBoltzContext,
  DepositBoltzStep,
} from '../../../contexts/deposit-boltz-context';
import { TransferPolicies } from './TransferPolicies';

export const AmountForm: React.FC = () => {
  const { amount, limits, fees, set } = useContext(DepositBoltzContext);

  const { checkMaintenance, States } = useMaintenance();
  const boltzLocked = checkMaintenance(States.BOLTZ_RECEIVE);

  const { balance } = useMaxAssetBalance(
    SupportedTokens.rbtc,
    defaultChainId,
    GAS_LIMIT.BOLTZ_SEND,
  );

  const [value, setValue] = useState(amount || '0');

  const maximumAmount = useMemo(() => {
    const feeForMaximumBalance = balance
      .mul(fees.percentage / 100)
      .add(
        decimalic(fees.minerFees.baseAsset.reverse.lockup).div(BTC_IN_SATOSHIS),
      );

    const amount = decimalic(limits.maximal).div(BTC_IN_SATOSHIS);

    const b = amount
      .sub(decimalic(fees.percentage / 100).mul(amount))
      .sub(
        decimalic(fees.minerFees.baseAsset.reverse.lockup).div(BTC_IN_SATOSHIS),
      );

    return Decimal.max(Decimal.min(b, balance.sub(feeForMaximumBalance)), 0);
  }, [
    balance,
    fees.minerFees.baseAsset.reverse.lockup,
    fees.percentage,
    limits.maximal,
  ]);

  const invalid = useMemo(() => {
    const amount = decimalic(value);
    if (
      amount.lte(0) ||
      amount.lt(decimalic(limits.minimal).div(BTC_IN_SATOSHIS)) ||
      amount.gt(decimalic(limits.maximal).div(BTC_IN_SATOSHIS))
    ) {
      return true;
    }

    const fee = amount
      .mul(fees.percentage / 100)
      .add(
        decimalic(fees.minerFees.baseAsset.reverse.lockup).div(BTC_IN_SATOSHIS),
      );

    return amount.add(fee).gt(balance);
  }, [
    value,
    limits.minimal,
    limits.maximal,
    fees.percentage,
    fees.minerFees.baseAsset.reverse.lockup,
    balance,
  ]);

  const onContinueClick = useCallback(
    () =>
      set(prevState => ({
        ...prevState,
        amount: Number(value).toFixed(8),
        step: DepositBoltzStep.REVIEW,
      })),
    [set, value],
  );

  const maxExceed = useMemo(() => {
    if (value === '0') {
      return false;
    }
    return decimalic(value).gt(decimalic(limits.maximal).div(BTC_IN_SATOSHIS));
  }, [limits.maximal, value]);

  const minSubceed = useMemo(() => {
    if (value === '0') {
      return false;
    }
    return decimalic(limits.minimal).div(BTC_IN_SATOSHIS).gt(value);
  }, [limits.minimal, value]);

  const onMaximumAmountClick = useCallback(
    () => setValue(maximumAmount.toString()),
    [maximumAmount],
  );

  useEffect(() => {
    localStorage.removeItem('reverse-swap');
  }, []);

  return (
    <>
      <Heading type={HeadingType.h2} className="font-medium mb-3 text-center">
        {t(translations.boltz.receive.amount.title)}
      </Heading>

      <div>
        <div className="flex items-center justify-between mb-3">
          <Paragraph size={ParagraphSize.base} className="font-medium">
            {t(translations.boltz.receive.amount.amountLabel)}
          </Paragraph>

          <MaxButton
            onClick={onMaximumAmountClick}
            value={maximumAmount}
            token={SupportedTokens.rbtc}
            precision={BTC_RENDER_PRECISION}
            dataAttribute="funding-receive-amount-max"
          />
        </div>

        <div>
          <AmountInput
            label={t(translations.common.amount)}
            onChangeText={setValue}
            unit={BITCOIN}
            value={value}
            decimalPrecision={BTC_RENDER_PRECISION}
            className="max-w-none"
            invalid={maxExceed}
            dataAttribute="funding-receive-amount-input"
          />

          {maxExceed && (
            <Paragraph className="text-error-light font-medium mt-2">
              {t(translations.fastBtc.send.addressForm.maxExceed)}
            </Paragraph>
          )}
          {minSubceed && (
            <Paragraph className="text-error-light font-medium mt-2">
              {t(translations.fastBtc.send.addressForm.minSubceed)}
            </Paragraph>
          )}
        </div>

        <TransferPolicies amount={value} />

        {boltzLocked ? (
          <ErrorBadge
            level={ErrorLevel.Warning}
            message={t(translations.maintenanceMode.boltz)}
            dataAttribute="funding-receive-amount-confirm-error"
          />
        ) : (
          <Button
            text={t(translations.common.buttons.continue)}
            onClick={onContinueClick}
            disabled={invalid || boltzLocked}
            style={ButtonStyle.secondary}
            className="mt-10 w-full"
            dataAttribute="funding-receive-amount-confirm"
          />
        )}
      </div>
    </>
  );
};
