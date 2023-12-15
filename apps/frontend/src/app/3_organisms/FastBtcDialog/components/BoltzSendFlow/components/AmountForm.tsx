import React, { useCallback, useContext, useMemo, useState } from 'react';

import { parseUnits } from 'ethers/lib/utils';
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

import { defaultChainId } from '../../../../../../config/chains';

import { MaxButton } from '../../../../../2_molecules/MaxButton/MaxButton';
import {
  BITCOIN,
  BTC_RENDER_PRECISION,
} from '../../../../../../constants/currencies';
import { BTC_IN_SATOSHIS } from '../../../../../../constants/general';
import { useAssetBalance } from '../../../../../../hooks/useAssetBalance';
import { useMaintenance } from '../../../../../../hooks/useMaintenance';
import { useMaxAssetBalance } from '../../../../../../hooks/useMaxAssetBalance';
import { translations } from '../../../../../../locales/i18n';
import { fromWei, toWei } from '../../../../../../utils/math';
import { GAS_LIMIT_FAST_BTC_WITHDRAW } from '../../../constants';
import { TransferPolicies } from './TransferPolicies';
import {
  WithdrawBoltzContext,
  WithdrawBoltzStep,
} from '../../../contexts/withdraw-boltz-context';

export const AmountForm: React.FC = () => {
  const { amount, limits, set } = useContext(WithdrawBoltzContext);

  const { checkMaintenance, States } = useMaintenance();
  const fastBtcLocked = checkMaintenance(States.FASTBTC_SEND);

  const { bigNumberBalance: maxAmountWei } = useMaxAssetBalance(
    SupportedTokens.rbtc,
  );

  const { bigNumberBalance: rbtcWeiBalance } = useAssetBalance(
    SupportedTokens.rbtc,
    defaultChainId,
  );

  const [value, setValue] = useState(amount || '0');

  const invalid = useMemo(() => {
    if (value === '0') {
      return true;
    }

    const amount = value;
    const satoshiAmount = Number(amount) * BTC_IN_SATOSHIS;

    if (
      satoshiAmount < 0 ||
      satoshiAmount < limits.min ||
      satoshiAmount > limits.max
    ) {
      return true;
    }

    return toWei(amount)
      .add(GAS_LIMIT_FAST_BTC_WITHDRAW)
      .gt(rbtcWeiBalance || '0');
  }, [value, limits.min, limits.max, rbtcWeiBalance]);

  const onContinueClick = useCallback(
    () =>
      set(prevState => ({
        ...prevState,
        amount: Number(value).toFixed(8),
        step: WithdrawBoltzStep.INVOICE,
      })),
    [set, value],
  );

  const maxAmount = useMemo(() => {
    const limit = parseUnits(limits.max.toString(), 10);
    return limit.gt(maxAmountWei) ? maxAmountWei : limit;
  }, [limits.max, maxAmountWei]);

  const maxExceed = useMemo(() => {
    if (value === '0') {
      return false;
    }
    return toWei(value).gt(maxAmount);
  }, [maxAmount, value]);

  const onMaximumAmountClick = useCallback(
    () => setValue(fromWei(maxAmount)),
    [maxAmount],
  );

  return (
    <>
      <Heading type={HeadingType.h2} className="font-medium mb-8 text-center">
        {t(translations.fastBtc.send.amountForm.title)}
      </Heading>

      <div>
        <div className="flex items-center justify-between mb-3">
          <Paragraph size={ParagraphSize.base} className="font-medium">
            {t(translations.fastBtc.send.amountForm.amountLabel)}
          </Paragraph>

          <MaxButton
            onClick={onMaximumAmountClick}
            value={fromWei(maxAmount)}
            token={SupportedTokens.rbtc}
            precision={BTC_RENDER_PRECISION}
            dataAttribute="funding-send-amount-max"
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
            dataAttribute="funding-send-amount-input"
          />

          {maxExceed && (
            <Paragraph className="text-error-light font-medium mt-2">
              {t(translations.fastBtc.send.addressForm.maxExceed)}
            </Paragraph>
          )}
        </div>

        <TransferPolicies />

        <Button
          text={t(translations.common.buttons.continue)}
          onClick={onContinueClick}
          disabled={invalid || fastBtcLocked}
          style={ButtonStyle.secondary}
          className="mt-10 w-full"
          dataAttribute="funding-send-amount-confirm"
        />

        {fastBtcLocked && (
          <ErrorBadge
            level={ErrorLevel.Warning}
            message={t(translations.maintenanceMode.fastBtc)}
            dataAttribute="funding-send-amount-confirm-error"
          />
        )}
      </div>
    </>
  );
};
