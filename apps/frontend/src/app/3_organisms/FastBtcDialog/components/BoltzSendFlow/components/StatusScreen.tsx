import React, { useCallback, useContext, useMemo } from 'react';

import classNames from 'classnames';
import { t } from 'i18next';

import {
  Button,
  ErrorBadge,
  ErrorLevel,
  Heading,
  HeadingType,
  Icon,
  IconNames,
  StatusType,
} from '@sovryn/ui';

import { AmountRenderer } from '../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { TxIdWithNotification } from '../../../../../2_molecules/TxIdWithNotification/TransactionIdWithNotification';
import { BITCOIN } from '../../../../../../constants/currencies';
import { useMaintenance } from '../../../../../../hooks/useMaintenance';
import { translations } from '../../../../../../locales/i18n';
import { getRskExplorerUrl } from '../../../../../../utils/helpers';
import { decimalic } from '../../../../../../utils/math';
import { WithdrawBoltzContext } from '../../../contexts/withdraw-boltz-context';
import {
  Status,
  BoltzTxStatus,
  SubmarineSwapResponse,
} from '../../../utils/boltz/boltz.types';
import { BoltzStatus } from './BoltzStatus';
import { getDescription, getTitle } from './StatusScreen.utils';

const translation = translations.boltz.send.confirmationScreens;

const rskExplorerUrl = getRskExplorerUrl();

type StatusScreenProps = {
  from: string;
  amount: string;
  txHash?: string;
  refundTxHash?: string;
  txStatus: StatusType;
  boltzStatus?: Status;
  swapData?: SubmarineSwapResponse;
  error?: string;
  onConfirm: () => void;
  onRefund: () => void;
  onClose: () => void;
  onRetry: () => void;
};

export const StatusScreen: React.FC<StatusScreenProps> = ({
  from,
  amount,
  txHash,
  txStatus,
  refundTxHash,
  boltzStatus,
  swapData,
  error,
  onConfirm,
  onRetry,
  onRefund,
  onClose,
}) => {
  const { fees } = useContext(WithdrawBoltzContext);
  const { checkMaintenance, States } = useMaintenance();
  const boltzLocked = checkMaintenance(States.BOLTZ_SEND);

  const conversionFee = useMemo(
    () => decimalic(amount).mul(decimalic(fees.percentage).div(100)),
    [amount, fees.percentage],
  );

  const sendAmount = useMemo(
    () =>
      decimalic(amount)
        .add(conversionFee)
        .add(decimalic(fees.minerFees).div(1e8)),
    [amount, conversionFee, fees.minerFees],
  );

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
          <AmountRenderer value={sendAmount} suffix={BITCOIN} precision={8} />
        ),
      },
      {
        label: t(translation.conversionFee),
        value: (
          <AmountRenderer
            value={conversionFee}
            suffix={BITCOIN}
            precision={8}
          />
        ),
      },
      {
        label: t(translation.networkFee),
        value: (
          <AmountRenderer
            value={decimalic(fees.minerFees).div(1e8)}
            suffix={BITCOIN}
            precision={8}
          />
        ),
      },
      {
        label: t(translation.receiving),
        value: (
          <AmountRenderer
            value={decimalic(amount)}
            suffix={BITCOIN}
            precision={8}
          />
        ),
      },
      {
        label: t(translation.swapId),
        value: swapData?.id ? swapData.id : <Icon icon={IconNames.PENDING} />,
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
      ...(refundTxHash
        ? [
            {
              label: t(translation.refundTx),
              value: (
                <TxIdWithNotification
                  value={refundTxHash}
                  href={`${rskExplorerUrl}/tx/${refundTxHash}`}
                />
              ),
            },
          ]
        : []),
    ],
    [
      from,
      sendAmount,
      conversionFee,
      fees.minerFees,
      amount,
      swapData,
      txHash,
      boltzStatus,
      refundTxHash,
    ],
  );

  const showButton = useMemo(
    () =>
      [StatusType.idle, StatusType.error].includes(txStatus) ||
      [
        BoltzTxStatus.paid,
        BoltzTxStatus.txClaimed,
        BoltzTxStatus.txRefunded,
        BoltzTxStatus.failedToPay,
        BoltzTxStatus.txLockupFailed,
      ].includes(boltzStatus as BoltzTxStatus),
    [boltzStatus, txStatus],
  );
  const disabledButton = useMemo(() => boltzLocked, [boltzLocked]);
  const buttonTitle = useMemo(() => {
    if ([BoltzTxStatus.txClaimed].includes(boltzStatus as BoltzTxStatus)) {
      return t(translations.common.buttons.done);
    }
    if (
      boltzStatus === BoltzTxStatus.failedToPay ||
      boltzStatus === BoltzTxStatus.txLockupFailed
    ) {
      return t(translations.common.buttons.refund);
    }
    if (txStatus === StatusType.idle) {
      return t(translations.common.buttons.confirm);
    }
    return t(translations.common.buttons.done);
  }, [boltzStatus, txStatus]);

  const handleButtonClick = useCallback(() => {
    if ([BoltzTxStatus.txClaimed].includes(boltzStatus as BoltzTxStatus)) {
      return onClose();
    }

    if (
      boltzStatus === BoltzTxStatus.failedToPay ||
      boltzStatus === BoltzTxStatus.txLockupFailed
    ) {
      return onRefund();
    }

    if (txStatus === StatusType.idle) {
      return onConfirm();
    }

    if (txStatus === StatusType.error) {
      return onRetry();
    }

    onClose();
  }, [boltzStatus, onClose, onConfirm, onRefund, onRetry, txStatus]);

  return (
    <div className="text-center">
      <Heading type={HeadingType.h2} className="font-medium mb-6">
        {getTitle(txStatus, boltzStatus!)}
      </Heading>

      <div className="mb-6">{getDescription(txStatus, boltzStatus!)}</div>

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

      {error && (
        <div className="mt-6">
          <ErrorBadge level={ErrorLevel.Critical} message={error} />
        </div>
      )}

      {showButton && (
        <div className="mt-8">
          <Button
            text={buttonTitle}
            onClick={handleButtonClick}
            disabled={disabledButton}
            className="w-full"
            dataAttribute="funding-send-confirm"
          />
          {boltzLocked && (
            <ErrorBadge
              level={ErrorLevel.Warning}
              message={t(translations.maintenanceMode.boltz)}
            />
          )}
        </div>
      )}
    </div>
  );
};
