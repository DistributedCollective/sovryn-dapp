import React, { useContext, useMemo } from 'react';

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
import { useAccount } from '../../../../../../hooks/useAccount';
import { translations } from '../../../../../../locales/i18n';
import { Bitcoin, btcInSatoshis } from '../../../../../../utils/constants';
import {
  getBtcExplorerUrl,
  getRskExplorerUrl,
} from '../../../../../../utils/helpers';
import { formatValue, fromWei, toWei } from '../../../../../../utils/math';
import { DEPOSIT_FEE_SATS } from '../../../constants';
import { DepositContext, DepositStep } from '../../../contexts/deposit-context';

const translation = translations.fastBtc.receive.statusScreen;

const rskExplorerUrl = getRskExplorerUrl();
const btcExplorerUrl = getBtcExplorerUrl();

type StatusScreenProps = {
  onClose: () => void;
};

export const StatusScreen: React.FC<StatusScreenProps> = ({ onClose }) => {
  const { account } = useAccount();
  const { step, depositTx, transferTx } = useContext(DepositContext);

  const isProcessing = useMemo(() => step === DepositStep.PROCESSING, [step]);

  const feeAmount = useMemo(() => toWei(DEPOSIT_FEE_SATS / btcInSatoshis), []);

  const amount = useMemo(() => {
    if (depositTx) {
      return depositTx.value;
    }
    if (transferTx) {
      return toWei(transferTx?.value || 0)
        .add(feeAmount)
        .toString();
    }
    return 0;
  }, [depositTx, transferTx, feeAmount]);

  const receiveAmount = useMemo(
    () => fromWei(toWei(amount).sub(feeAmount)),
    [amount, feeAmount],
  );

  const items = useMemo(
    () => [
      {
        label: t(translation.to),
        value: (
          <TransactionId
            value={account}
            href={`${rskExplorerUrl}/address/${account}`}
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
            {formatValue(Number(fromWei(feeAmount)), 8)} {Bitcoin}
          </>
        ),
      },
      {
        label: t(translation.receiving),
        value: (
          <>
            {formatValue(Number(receiveAmount), 8)} {Bitcoin}
          </>
        ),
      },
      {
        label: t(translation.bitcoinTxId),
        value: depositTx ? (
          <>
            <TransactionId
              value={depositTx.txHash}
              href={`${btcExplorerUrl}/tx/${depositTx.txHash}`}
            />
          </>
        ) : (
          <Icon icon={IconNames.PENDING} />
        ),
      },
      {
        label: t(translation.rootstockTxId),
        value: transferTx ? (
          <>
            <TransactionId
              value={transferTx.txHash}
              href={`${rskExplorerUrl}/tx/${transferTx.txHash}`}
            />
          </>
        ) : (
          <Icon icon={IconNames.PENDING} />
        ),
      },
    ],
    [account, amount, depositTx, feeAmount, receiveAmount, transferTx],
  );

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
            dataAttribute="fastBtc-receive"
          />
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
        className="mt-8 w-full"
        dataAttribute="fastBtc-receive-done-button"
      />
    </>
  );
};
