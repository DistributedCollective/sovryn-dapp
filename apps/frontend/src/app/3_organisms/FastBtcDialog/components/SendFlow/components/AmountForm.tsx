import React, { useCallback, useContext, useMemo, useState } from 'react';

import { BigNumber } from 'ethers';

import { SupportedTokens } from '@sovryn/contracts';
import {
  AmountInput,
  applyDataAttr,
  Button,
  Heading,
  Paragraph,
} from '@sovryn/ui';

import { defaultChainId } from '../../../../../../config/chains';
import { useAssetBalance } from '../../../../../../hooks/useAssetBalance';
import { useMaintenance } from '../../../../../../hooks/useMaintenance';
import { btcInSatoshis } from '../../../../../../utils/constants';
import { formatValue, fromWei } from '../../../../../../utils/math';
import { FAST_BTC_ASSET } from '../../../constants';
import {
  WithdrawContext,
  WithdrawStep,
} from '../../../contexts/withdraw-context';

export const GAS_LIMIT_FAST_BTC_WITHDRAW = 300000; // TODO: Find a suitable place for it

export const AmountForm: React.FC = () => {
  const { amount, limits, set } = useContext(WithdrawContext);

  const { checkMaintenance, States } = useMaintenance();
  const fastBtcLocked = checkMaintenance(States.FASTBTC);

  const { value: rbtcWeiBalance } = useAssetBalance(
    SupportedTokens.rbtc,
    defaultChainId,
  );

  const rbtcBalance = useMemo(() => fromWei(rbtcWeiBalance), [rbtcWeiBalance]);

  const [value, setValue] = useState(amount);

  const invalid = useMemo(() => {
    const amount = value;
    const satoshiAmount = Number(amount) * btcInSatoshis;
    const satoshiAmountBigNumber = BigNumber.from(satoshiAmount);
    if (
      satoshiAmountBigNumber.lte(0) ||
      satoshiAmountBigNumber.lt(limits.min) ||
      satoshiAmountBigNumber.gt(limits.max)
    ) {
      return true;
    }

    return satoshiAmountBigNumber
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
      <Heading>Enter amount of Rootstock BTC to send</Heading>

      <div>
        <div className="flex">
          <Paragraph>Send</Paragraph>

          <button
            onClick={onMaximumAmountClick}
            className="text-xs font-medium underline whitespace-nowrap"
            {...applyDataAttr('convert-to-max')}
          >
            Max {formatValue(Number(rbtcBalance), 4)}{' '}
            {FAST_BTC_ASSET.toUpperCase()})
          </button>
        </div>

        <div>
          <AmountInput onChangeText={setValue} decimalPrecision={8} />
        </div>

        <div>TBD: Policies</div>

        <Button
          text="Continue"
          onClick={onContinueClick}
          disabled={invalid || fastBtcLocked}
        />
        {fastBtcLocked && <div>Fast BTC is in maintenance mode</div>}
      </div>
    </>
  );
};
