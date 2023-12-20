import React, { useEffect, useMemo } from 'react';

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
import { BITCOIN } from '../../../../../../constants/currencies';
import { useBlockNumber } from '../../../../../../hooks/useBlockNumber';
import { translations } from '../../../../../../locales/i18n';
import { useGetBitcoinTxIdQuery } from '../../../../../../utils/graphql/rsk/generated';
import { getRskExplorerUrl } from '../../../../../../utils/helpers';
import { formatValue } from '../../../../../../utils/math';
import { BoltzStatus, BoltzStatusType } from './BoltzStatus';

const translation = translations.boltz.send.confirmationScreens;

const getTitle = (status: StatusType) => {
  return 'title';
  // switch (status) {
  //   case StatusType.error:
  //     return t(translation.statusTitleFailed);
  //   case StatusType.success:
  //     return t(translation.statusTitleComplete);
  //   default:
  //     return t(translation.statusTitleProcessing);
  // }
};

const rskExplorerUrl = getRskExplorerUrl();

type StatusScreenProps = {
  from: string;
  to: string;
  amount: string;
  feesPaid: number;
  receiveAmount: number;
  txHash?: string;
  txStatus: StatusType;
  boltzStatus?: BoltzStatusType;
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
  boltzStatus,
  onClose,
  onRetry,
}) => {
  const { value: block } = useBlockNumber();

  const { data, refetch } = useGetBitcoinTxIdQuery({
    variables: { createdAtTx: txHash || '' },
  });

  const bitcoinTxHash = useMemo(
    () => data?.bitcoinTransfers?.[0]?.bitcoinTxHash,
    [data],
  );

  useEffect(() => {
    refetch();
  }, [refetch, txHash, block]);

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
        label: t(translation.sending),
        value: (
          <>
            {formatValue(Number(amount), 8)} {BITCOIN}
          </>
        ),
      },
      {
        label: t(translation.conversionFee),
        value: (
          <>
            {formatValue(Number(amount), 8)} {BITCOIN}
          </>
        ),
      },
      {
        label: t(translation.networkFee),
        value: (
          <>
            {formatValue(Number(amount), 8)} {BITCOIN}
          </>
        ),
      },
      {
        label: t(translation.receiving),
        value: (
          <>
            {formatValue(receiveAmount, 8)} {BITCOIN}
          </>
        ),
      },
      {
        label: t(translation.rootstockTx),
        value: txHash ? (
          <TxIdWithNotification
            value={txHash!}
            href={`${rskExplorerUrl}/tx/${txHash}`}
          />
        ) : (
          <Icon icon={IconNames.PENDING} />
        ),
      },
      {
        label: t(translation.lightningInvoiceStatus),
        value: <BoltzStatus status={boltzStatus} />,
      },
    ],
    [amount, from, receiveAmount, txHash, boltzStatus],
  );

  const status = useMemo(() => {
    if (txStatus !== StatusType.success) {
      return txStatus;
    }

    if (!bitcoinTxHash) {
      return StatusType.pending;
    }

    return StatusType.success;
  }, [bitcoinTxHash, txStatus]);

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
