import React, { useCallback, useContext, useMemo } from 'react';

import classNames from 'classnames';
import { t } from 'i18next';

import { Button, Heading, HeadingType, TransactionId } from '@sovryn/ui';

import { useTransactionContext } from '../../../../../../contexts/TransactionContext';
import { useMaintenance } from '../../../../../../hooks/useMaintenance';
import { translations } from '../../../../../../locales/i18n';
import {
  getBtcExplorerUrl,
  getRskExplorerUrl,
} from '../../../../../../utils/helpers';
import { formatValue } from '../../../../../../utils/math';
import { TransactionStepDialog } from '../../../../TransactionStepDialog';
import { FAST_BTC_ASSET } from '../../../constants';
import {
  WithdrawContext,
  WithdrawStep,
} from '../../../contexts/withdraw-context';

const translation = translations.fastBtc.send.confirmationScreens;

type ReviewScreenProps = {
  from: string;
  to: string;
  amount: string;
  feesPaid: number;
  receiveAmount: number;
  onConfirm: () => void;
};

export const ReviewScreen: React.FC<ReviewScreenProps> = ({
  amount,
  onConfirm,
  feesPaid,
  receiveAmount,
  from,
  to,
}) => {
  const { checkMaintenance, States } = useMaintenance();
  const fastBtcLocked = checkMaintenance(States.FASTBTC);

  const { set } = useContext(WithdrawContext);
  const { setIsOpen } = useTransactionContext();

  const items = useMemo(
    () => [
      {
        label: t(translation.from),
        value: (
          <TransactionId value={from} href={`${getRskExplorerUrl()}/${from}`} />
        ),
      },
      {
        label: t(translation.to),
        value: (
          <TransactionId value={to} href={`${getBtcExplorerUrl()}/${to}`} />
        ),
      },
      {
        label: t(translation.sending),
        value: (
          <>
            {formatValue(Number(amount), 8)} {FAST_BTC_ASSET.toUpperCase()}
          </>
        ),
      },
      {
        label: t(translation.serviceFee),
        value: (
          <>
            {formatValue(feesPaid, 8)} {FAST_BTC_ASSET.toUpperCase()}
          </>
        ),
      },
      {
        label: t(translation.receiving),
        value: (
          <>
            {formatValue(receiveAmount, 8)} {FAST_BTC_ASSET.toUpperCase()}
          </>
        ),
      },
    ],
    [amount, feesPaid, from, receiveAmount, to],
  );

  const onTransactionConfirm = useCallback(() => {
    set(prevState => ({ ...prevState, step: WithdrawStep.CONFIRM }));
    setIsOpen(false);
  }, [set, setIsOpen]);

  return (
    <div className="text-center">
      <Heading type={HeadingType.h2} className="font-medium mb-8">
        {t(translation.reviewTitle)}
      </Heading>

      <div className="bg-gray-80 border rounded border-gray-50 p-3 text-xs text-gray-30">
        {items.map(({ label, value }, index) => (
          <div
            className={classNames('flex justify-between', {
              'mb-3': index !== items.length - 1,
            })}
          >
            <span>{label} </span>
            <span>{value}</span>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <Button
          text={t(translations.common.buttons.confirm)}
          onClick={onConfirm}
          disabled={fastBtcLocked}
          className="w-full"
        />
        {fastBtcLocked && <div>Fast BTC is in maintenance mode</div>}
      </div>
      <TransactionStepDialog
        disableFocusTrap={false}
        onConfirm={onTransactionConfirm}
      />
    </div>
  );
};
