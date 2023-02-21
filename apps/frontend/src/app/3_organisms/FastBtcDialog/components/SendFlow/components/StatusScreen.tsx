import React, { useMemo } from 'react';

import classNames from 'classnames';
import { t } from 'i18next';

import {
  Button,
  Heading,
  HeadingType,
  Icon,
  IconNames,
  StatusType,
  TransactionId,
} from '@sovryn/ui';

import { StatusIcon } from '../../../../../2_molecules/StatusIcon/StatusIcon';
import { useCopyAddress } from '../../../../../../hooks/useCopyAddress';
import { translations } from '../../../../../../locales/i18n';
import { Bitcoin } from '../../../../../../utils/constants';
import {
  getBtcExplorerUrl,
  getRskExplorerUrl,
} from '../../../../../../utils/helpers';
import { formatValue } from '../../../../../../utils/math';

const translation = translations.fastBtc.send.confirmationScreens;

const getTitle = (status: StatusType) => {
  switch (status) {
    case StatusType.error:
      return t(translation.statusTitleFailed);
    case StatusType.success:
      return t(translation.statusTitleComplete);
    default:
      return t(translation.statusTitleProcessing);
  }
};

const rskExplorerUrl = getRskExplorerUrl();
const btcExplorerUrl = getBtcExplorerUrl();

type StatusScreenProps = {
  from: string;
  to: string;
  amount: string;
  feesPaid: number;
  receiveAmount: number;
  txHash?: string;
  txStatus: StatusType;
  onClose: () => void;
  onRetry: () => void;
};

export const StatusScreen: React.FC<StatusScreenProps> = ({
  from,
  to,
  amount,
  feesPaid,
  receiveAmount,
  txHash,
  txStatus,
  onClose,
  onRetry,
}) => {
  const onCopyAddress = useCopyAddress();
  const hasTransactionFailed = useMemo(
    () => txStatus === StatusType.error,
    [txStatus],
  );

  const isDoneButtonDisabled = useMemo(
    () => txStatus === StatusType.pending,
    [txStatus],
  );

  const items = useMemo(
    () => [
      {
        label: t(translation.from),
        value: (
          <TransactionId
            value={from}
            href={`${rskExplorerUrl}/address/${from}`}
            onCopyAddress={onCopyAddress}
          />
        ),
      },
      {
        label: t(translation.to),
        value: (
          <TransactionId
            value={to}
            href={`${btcExplorerUrl}/address/${to}`}
            onCopyAddress={onCopyAddress}
          />
        ),
      },
      {
        label: t(translation.sending),
        value: (
          <>
            {formatValue(Number(amount), 8)} {Bitcoin}
          </>
        ),
      },
      {
        label: t(translation.serviceFee),
        value: (
          <>
            {formatValue(feesPaid, 8)} {Bitcoin}
          </>
        ),
      },
      {
        label: t(translation.receiving),
        value: (
          <>
            {formatValue(receiveAmount, 8)} {Bitcoin}
          </>
        ),
      },
      {
        label: t(translation.hash),
        value: txHash ? (
          <TransactionId
            value={txHash}
            href={`${rskExplorerUrl}/tx/${txHash}`}
            onCopyAddress={onCopyAddress}
          />
        ) : (
          <Icon icon={IconNames.PENDING} />
        ),
      },
    ],
    [amount, feesPaid, from, receiveAmount, to, txHash, onCopyAddress],
  );

  return (
    <div className="text-center">
      <Heading type={HeadingType.h2} className="font-medium mb-6">
        {getTitle(txStatus)}
      </Heading>

      <div className="mb-6">
        <StatusIcon status={txStatus} dataAttribute="funding-send-status" />
      </div>

      <div className="bg-gray-80 border rounded border-gray-50 p-3 text-xs text-gray-30">
        {items.map(({ label, value }, index) => (
          <div
            className={classNames('flex justify-between', {
              'mb-3': index !== items.length - 1,
            })}
            key={label}
          >
            <span>{label} </span>
            <span>{value}</span>
          </div>
        ))}
      </div>

      <Button
        text={t(
          translations.common.buttons[hasTransactionFailed ? 'retry' : 'done'],
        )}
        onClick={hasTransactionFailed ? onRetry : onClose}
        disabled={isDoneButtonDisabled}
        className="mt-8 w-full"
        dataAttribute={`funding-send-${
          hasTransactionFailed ? 'retry' : 'done'
        }`}
      />
    </div>
  );
};
