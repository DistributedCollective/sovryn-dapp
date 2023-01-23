import React, { useMemo } from 'react';

import classNames from 'classnames';
import { t } from 'i18next';

import {
  Button,
  Heading,
  HeadingType,
  Icon,
  IconNames,
  TransactionId,
} from '@sovryn/ui';

import { StatusIcon } from '../../../../../2_molecules/StatusIcon/StatusIcon';
import { translations } from '../../../../../../locales/i18n';
import {
  getBtcExplorerUrl,
  getRskExplorerUrl,
} from '../../../../../../utils/helpers';
import { formatValue } from '../../../../../../utils/math';
import { TransactionStepDialog } from '../../../../TransactionStepDialog';
import { FAST_BTC_ASSET } from '../../../constants';

const translation = translations.fastBtc.send.confirmationScreens;

type StatusScreenProps = {
  from: string;
  to: string;
  amount: string;
  feesPaid: number;
  receiveAmount: number;
  txHash?: string;
  onClose: () => void;
};

export const StatusScreen: React.FC<StatusScreenProps> = ({
  from,
  to,
  amount,
  feesPaid,
  receiveAmount,
  txHash,
  onClose,
}) => {
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
      {
        label: t(translation.hash),
        value: txHash ? (
          <TransactionId
            value={txHash}
            href={`${getRskExplorerUrl()}/${txHash}`}
          />
        ) : (
          <Icon icon={IconNames.PENDING} />
        ),
      },
    ],
    [amount, feesPaid, from, receiveAmount, to, txHash],
  );

  return (
    <div className="text-center">
      <Heading type={HeadingType.h2} className="font-medium mb-6">
        {!txHash
          ? t(translation.statusTitleProcessing)
          : t(translation.statusTitleComplete)}
      </Heading>

      <div className="mb-6">
        <StatusIcon isConfirmed={!!txHash} />
      </div>

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

      <Button
        text={t(translations.common.buttons.done)}
        onClick={onClose}
        className="mt-8 w-full"
      />
      <TransactionStepDialog disableFocusTrap={false} />
    </div>
  );
};
