import React, { useCallback, useContext, useMemo, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { SupportedTokens } from '@sovryn/contracts';
import {
  AmountInput,
  applyDataAttr,
  Button,
  ButtonStyle,
  Heading,
  HeadingType,
  Paragraph,
  ParagraphSize,
} from '@sovryn/ui';

import { defaultChainId } from '../../../../../../config/chains';
import { useAssetBalance } from '../../../../../../hooks/useAssetBalance';
import { useMaintenance } from '../../../../../../hooks/useMaintenance';
import { translations } from '../../../../../../locales/i18n';
import { btcInSatoshis } from '../../../../../../utils/constants';
import { formatValue, fromWei, toWei } from '../../../../../../utils/math';
import { FAST_BTC_ASSET } from '../../../constants';
import {
  WithdrawContext,
  WithdrawStep,
} from '../../../contexts/withdraw-context';
import { TransferPolicies } from './TransferPolicies';

export const GAS_LIMIT_FAST_BTC_WITHDRAW = 300000; // TODO: Find a suitable place for it

export const AmountForm: React.FC = () => {
  const { t } = useTranslation();

  const { amount, limits, set } = useContext(WithdrawContext);

  const { checkMaintenance, States } = useMaintenance();
  const fastBtcLocked = checkMaintenance(States.FASTBTC);

  const { value: rbtcWeiBalance } = useAssetBalance(
    SupportedTokens.rbtc,
    defaultChainId,
  );

  const rbtcBalance = useMemo(() => fromWei(rbtcWeiBalance), [rbtcWeiBalance]);

  const [value, setValue] = useState(amount || '0');

  const invalid = useMemo(() => {
    if (value === '0') {
      return true;
    }

    const amount = value;
    const satoshiAmount = Number(amount) * btcInSatoshis;

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

  const onMaximumAmountClick = useCallback(
    () => setValue(rbtcBalance),
    [rbtcBalance],
  );

  const onContinueClick = useCallback(
    () =>
      set(prevState => ({
        ...prevState,
        amount: value,
        step: WithdrawStep.ADDRESS,
      })),
    [set, value],
  );

  return (
    <>
      <Heading type={HeadingType.h2} className="font-medium mb-8">
        {t(translations.fastBtc.send.amountForm.title)}
      </Heading>

      <div>
        <div className="flex items-center justify-between mb-3">
          <Paragraph size={ParagraphSize.base} className="font-medium">
            {t(translations.fastBtc.send.amountForm.amountLabel)}
          </Paragraph>

          <button
            onClick={onMaximumAmountClick}
            className="text-xs font-medium underline whitespace-nowrap"
            {...applyDataAttr('convert-to-max')}
          >
            ({t(translations.common.max)} {formatValue(Number(rbtcBalance), 4)}{' '}
            {FAST_BTC_ASSET.toUpperCase()})
          </button>
        </div>

        <div>
          <AmountInput
            label={t(translations.common.amount)}
            onChangeText={setValue}
            decimalPrecision={8}
            unit={FAST_BTC_ASSET.toUpperCase()}
            value={value}
          />
        </div>

        <TransferPolicies />

        <div className="px-8">
          <Button
            text={t(translations.common.buttons.continue)}
            onClick={onContinueClick}
            disabled={invalid || fastBtcLocked}
            style={ButtonStyle.secondary}
            className="mt-10 w-full"
          />
        </div>
        {fastBtcLocked && <div>Fast BTC is in maintenance mode</div>}
      </div>
    </>
  );
};
