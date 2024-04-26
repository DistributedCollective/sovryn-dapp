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
import { useAccount } from '../../../../../../hooks/useAccount';
import { translations } from '../../../../../../locales/i18n';
import {
  getBtcExplorerUrl,
  getRskExplorerUrl,
} from '../../../../../../utils/helpers';
import { formatValue } from '../../../../../../utils/math';
import {
  ReceiveflowStep,
  TransferStatusType,
} from '../../../contexts/receiveflow';
import { useReceiveFlowContext } from '../../../contexts/receiveflow';
import { useTranslationContext } from '../../../contexts/translation';

const translation = translations.runeBridge.receive.statusScreen;

const rskExplorerUrl = getRskExplorerUrl();
const btcExplorerUrl = getBtcExplorerUrl();

type StatusScreenProps = {
  onClose: () => void;
};

const formatTxStatus = (status: TransferStatusType, service: string) => {
  switch (status) {
    case 'detected':
    case 'seen':
    case 'sent_to_evm':
    case 'confirmed':
      return t(translation.transferStatus[status], { service });
    default:
      return status;
  }
};

export const StatusScreen: React.FC<StatusScreenProps> = ({ onClose }) => {
  const { account } = useAccount();
  const { step, depositTx } = useReceiveFlowContext();
  const { service, chainName } = useTranslationContext();
  const isProcessing = useMemo(
    () => step === ReceiveflowStep.PROCESSING,
    [step],
  );

  const items = useMemo(() => {
    const { currentTX } = depositTx;
    const runeSymbol = currentTX.runeSymbol ?? currentTX.runeName;
    const fee = Number(currentTX.feeDecimal || 0);
    const amount = Number(currentTX.amountDecimal || 0);
    const receiveAmount = Number(currentTX.receiveAmountDecimal || 0);

    return [
      {
        label: t(translation.to),
        value: (
          <TxIdWithNotification
            value={account}
            href={`${rskExplorerUrl}/address/${account}`}
          />
        ),
      },
      {
        label: t(translation.sending),
        value: amount ? (
          <>
            {formatValue(amount, 8)} {runeSymbol}
          </>
        ) : (
          <Icon icon={IconNames.PENDING} />
        ),
      },
      {
        label: t(translation.serviceFee),
        value: fee ? (
          <>
            {formatValue(fee, 8)} {runeSymbol}
          </>
        ) : (
          <Icon icon={IconNames.PENDING} />
        ),
      },
      {
        label: t(translation.receiving),
        value: receiveAmount ? (
          <>
            {formatValue(receiveAmount, 8)} {runeSymbol}
          </>
        ) : (
          <Icon icon={IconNames.PENDING} />
        ),
      },
      {
        label: t(translation.bitcoinTxId),
        value: currentTX ? (
          <>
            <TxIdWithNotification
              value={currentTX.btcDepositTxid}
              href={`${btcExplorerUrl}/tx/${currentTX.btcDepositTxid}`}
            />
          </>
        ) : (
          <Icon icon={IconNames.PENDING} />
        ),
      },
      {
        label: t(translation.currentChainTxId, { chainName }),
        value: currentTX ? (
          <>
            <TxIdWithNotification
              value={currentTX.evmTransferTxHash}
              href={`${rskExplorerUrl}/tx/${currentTX.evmTransferTxHash}`}
            />
          </>
        ) : (
          <Icon icon={IconNames.PENDING} />
        ),
      },
    ].filter(x => x);
  }, [account, chainName, depositTx]);

  return (
    <>
      <div className="text-center">
        <Heading type={HeadingType.h2} className="font-medium mb-6">
          {isProcessing
            ? t(translation.statusTitleProcessing)
            : t(translation.statusTitleComplete)}
        </Heading>

        <div className="mb-6">
          <StatusIcon
            status={isProcessing ? StatusType.pending : StatusType.success}
            dataAttribute="funding-receive-status"
          />
        </div>
        <div className="mb-6">
          {formatTxStatus(depositTx.currentTX.status, service)}
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
      </div>

      <Button
        text={t(translations.common.buttons.done)}
        onClick={onClose}
        disabled={isProcessing}
        className="mt-8 w-full"
        dataAttribute="funding-receive-done"
      />
    </>
  );
};
