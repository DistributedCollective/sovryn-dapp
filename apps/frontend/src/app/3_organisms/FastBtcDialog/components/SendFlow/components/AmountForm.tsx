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

import { AmountRenderer } from '../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { useAssetBalance } from '../../../../../../hooks/useAssetBalance';
import { useMaintenance } from '../../../../../../hooks/useMaintenance';
import { useMaxAssetBalance } from '../../../../../../hooks/useMaxAssetBalance';
import { translations } from '../../../../../../locales/i18n';
import { Bitcoin, btcInSatoshis } from '../../../../../../utils/constants';
import { fromWei, toWei } from '../../../../../../utils/math';
import { GAS_LIMIT_FAST_BTC_WITHDRAW } from '../../../constants';
import {
  WithdrawContext,
  WithdrawStep,
} from '../../../contexts/withdraw-context';
import { TransferPolicies } from './TransferPolicies';

export const AmountForm: React.FC = () => {
  const { t } = useTranslation();

  const { amount, limits, set } = useContext(WithdrawContext);

  const { checkMaintenance, States } = useMaintenance();
  const fastBtcLocked = checkMaintenance(States.FASTBTC);

  const { value: maxAmountWei } = useMaxAssetBalance(SupportedTokens.rbtc);

  const { value: rbtcWeiBalance } = useAssetBalance(
    SupportedTokens.rbtc,
    defaultChainId,
  );

  const maxRbtcBalance = useMemo(() => fromWei(maxAmountWei), [maxAmountWei]);

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
    () => setValue(maxRbtcBalance),
    [maxRbtcBalance],
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
      <Heading type={HeadingType.h2} className="font-medium mb-8 text-center">
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
            ({t(translations.common.max)}{' '}
            <AmountRenderer
              value={maxRbtcBalance}
              suffix={Bitcoin}
              precision={8}
            />
            )
          </button>
        </div>

        <div>
          <AmountInput
            label={t(translations.common.amount)}
            onChangeText={setValue}
            decimalPrecision={8}
            unit={Bitcoin}
            value={value}
            className="max-w-none"
          />
        </div>

        <TransferPolicies />

        <Button
          text={t(translations.common.buttons.continue)}
          onClick={onContinueClick}
          disabled={invalid || fastBtcLocked}
          style={ButtonStyle.secondary}
          className="mt-10 w-full"
        />

        {fastBtcLocked && <div>{t(translations.maintenanceMode.fastBtc)}</div>}
      </div>
    </>
  );
};
