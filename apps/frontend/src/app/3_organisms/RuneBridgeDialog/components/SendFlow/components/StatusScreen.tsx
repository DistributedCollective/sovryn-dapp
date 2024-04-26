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
} from '@sovryn/ui';

import { StatusIcon } from '../../../../../2_molecules/StatusIcon/StatusIcon';
import { TxIdWithNotification } from '../../../../../2_molecules/TxIdWithNotification/TransactionIdWithNotification';
import { translations } from '../../../../../../locales/i18n';
import {
  getBtcExplorerUrl,
  getRskExplorerUrl,
} from '../../../../../../utils/helpers';
import { formatValue } from '../../../../../../utils/math';
import { useSendFlowContext } from '../../../contexts/sendflow';
import { TranslationContext } from '../../../contexts/translation';

const translation = translations.runeBridge.send.confirmationScreens;

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

interface FeesPaid {
  rune: number;
  baseCurrency: number;
}

type StatusScreenProps = {
  from: string;
  to: string;
  amount: string;
  feesPaid: FeesPaid;
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
  const { selectedToken } = useSendFlowContext();
  const { service } = React.useContext(TranslationContext);
  const items = useMemo(
    () => [
      {
        label: t(translation.from),
        value: (
          <TxIdWithNotification
            value={from}
            href={`${rskExplorerUrl}/address/${from}`}
          />
        ),
      },
      {
        label: t(translation.to),
        value: (
          <TxIdWithNotification
            value={to}
            href={`${btcExplorerUrl}/address/${to}`}
          />
        ),
      },
      {
        label: t(translation.sending),
        value: (
          <>
            {formatValue(Number(amount), 8)} {selectedToken.symbol}
          </>
        ),
      },
      {
        label: t(translation.serviceFee),
        value: (
          <>
            {formatValue(feesPaid.rune, 8)} {selectedToken.symbol} +{' '}
            {formatValue(feesPaid.baseCurrency, 8)} BTC
          </>
        ),
      },
      {
        label: t(translation.receiving),
        value: (
          <>
            {formatValue(receiveAmount, 8)} {selectedToken.symbol}
          </>
        ),
      },
      {
        label: t(translation.hash, { service }),
        value: txHash ? (
          <TxIdWithNotification
            value={txHash}
            href={`${rskExplorerUrl}/tx/${txHash}`}
          />
        ) : (
          <Icon icon={IconNames.PENDING} />
        ),
      },
      // We don't yet have an API for this
      // {
      //   label: t(translation.bitcoinTxId),
      //   value: bitcoinTxHash ? (
      //     <TxIdWithNotification
      //       value={bitcoinTxHash}
      //       href={`${btcExplorerUrl}/tx/${bitcoinTxHash}`}
      //     />
      //   ) : (
      //     <Icon icon={IconNames.PENDING} />
      //   ),
      // },
    ],
    [
      amount,
      feesPaid.baseCurrency,
      feesPaid.rune,
      from,
      receiveAmount,
      selectedToken.symbol,
      service,
      to,
      txHash,
    ],
  );

  const status = useMemo(() => {
    if (txStatus !== StatusType.success) {
      return txStatus;
    }

    return StatusType.success;
  }, [txStatus]);

  const hasTransactionFailed = useMemo(
    () => status === StatusType.error,
    [status],
  );

  const isDoneButtonDisabled = useMemo(
    () => status === StatusType.pending,
    [status],
  );
  return (
    <div className="text-center">
      <Heading type={HeadingType.h2} className="font-medium mb-6">
        {getTitle(status)}
      </Heading>

      <div className="mb-6">
        <StatusIcon status={status} dataAttribute="funding-send-status" />
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
