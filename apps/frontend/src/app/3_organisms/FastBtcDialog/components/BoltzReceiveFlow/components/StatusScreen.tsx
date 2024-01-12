import React, { useCallback, useMemo } from 'react';

import classNames from 'classnames';
import { formatUnits } from 'ethers/lib/utils';
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
import { Decimalish } from '@sovryn/utils';

import { AmountRenderer } from '../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { TxIdWithNotification } from '../../../../../2_molecules/TxIdWithNotification/TransactionIdWithNotification';
import { BITCOIN } from '../../../../../../constants/currencies';
import { useMaintenance } from '../../../../../../hooks/useMaintenance';
import { translations } from '../../../../../../locales/i18n';
import { getRskExplorerUrl } from '../../../../../../utils/helpers';
import { formatValue } from '../../../../../../utils/math';
import { ReverseSwap } from '../../../../Boltz/Boltz.type';
import {
  BoltzStatus,
  BoltzStatusType,
} from '../../BoltzSendFlow/components/BoltzStatus';
import { InvoiceScreen } from './InvoiceScreen';
import { getDescription, getTitle } from './StatusScreen.utils';

const translation = translations.boltz.receive.confirmationScreens;

const rskExplorerUrl = getRskExplorerUrl();

type StatusScreenProps = {
  to: string;
  amount: string;
  receiveAmount: Decimalish;
  invoice: string;
  txHash?: string;
  txStatus: StatusType;
  boltzStatus?: BoltzStatusType;
  swapData?: ReverseSwap;
  onClaim: () => void;
  onClose: () => void;
  onRetry: () => void;
  networkFee: Decimalish;
  conversionFee: Decimalish;
};

export const StatusScreen: React.FC<StatusScreenProps> = ({
  to,
  amount,
  receiveAmount,
  txHash,
  txStatus,
  boltzStatus,
  swapData,
  onRetry,
  onClose,
  networkFee,
  conversionFee,
  invoice,
  onClaim,
}) => {
  const { checkMaintenance, States } = useMaintenance();
  const boltzLocked = checkMaintenance(States.BOLTZ_RECEIVE);

  const items = useMemo(
    () => [
      {
        label: t(translation.to),
        value: (
          <TxIdWithNotification
            value={to}
            href={`${rskExplorerUrl}/address/${to}`}
          />
        ),
      },
      {
        label: t(translation.receiving),
        value: (
          <AmountRenderer
            value={formatUnits(receiveAmount.toString(), 8)}
            suffix={BITCOIN}
            precision={8}
          />
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
          <AmountRenderer value={networkFee} suffix={BITCOIN} precision={8} />
        ),
      },
      {
        label: t(translation.amountSent),
        value: (
          <>
            {formatValue(Number(amount), 8)} {BITCOIN}
          </>
        ),
      },
      {
        label: t(translation.swapId),
        value: swapData?.id ? swapData.id : <Icon icon={IconNames.PENDING} />,
      },
      {
        label: t(translation.lightningInvoice),
        value:
          boltzStatus === BoltzStatusType.txConfirmed ? (
            <span className="text-success">
              {t(translations.boltz.receive.confirmationScreens.paid)}
            </span>
          ) : (
            <BoltzStatus status={boltzStatus} />
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
    ],
    [
      to,
      receiveAmount,
      conversionFee,
      networkFee,
      amount,
      swapData,
      boltzStatus,
      txHash,
    ],
  );

  const showButton = useMemo(
    () =>
      boltzStatus &&
      [
        BoltzStatusType.txConfirmed,
        BoltzStatusType.paid,
        BoltzStatusType.settled,
      ].includes(boltzStatus),
    [boltzStatus],
  );

  const disabledButton = useMemo(
    () => boltzLocked || txStatus === StatusType.pending,
    [boltzLocked, txStatus],
  );
  const buttonTitle = useMemo(() => {
    if (
      boltzStatus === BoltzStatusType.txConfirmed &&
      txStatus === StatusType.idle
    ) {
      return t(translations.boltz.receive.finalize);
    }
    if (txStatus === StatusType.error) {
      return t(translations.common.buttons.retry);
    }
    return t(translations.common.buttons.done);
  }, [boltzStatus, txStatus]);

  const handleButtonClick = useCallback(() => {
    if (
      boltzStatus === BoltzStatusType.txConfirmed &&
      txStatus === StatusType.idle
    ) {
      return onClaim();
    }

    if (txStatus === StatusType.error) {
      return onRetry();
    }

    onClose();
  }, [boltzStatus, onClaim, onClose, onRetry, txStatus]);

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

      {showButton && (
        <div className="mt-8">
          {boltzLocked ? (
            <ErrorBadge
              level={ErrorLevel.Warning}
              message={t(translations.maintenanceMode.boltz)}
            />
          ) : (
            <Button
              text={buttonTitle}
              onClick={handleButtonClick}
              disabled={disabledButton}
              className="w-full"
              dataAttribute="funding-receive-confirm"
            />
          )}
        </div>
      )}

      {boltzStatus === BoltzStatusType.swapCreated && (
        <InvoiceScreen invoice={invoice} />
      )}
    </div>
  );
};
