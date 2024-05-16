import React, { useMemo } from 'react';

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
  Paragraph,
  ParagraphSize,
} from '@sovryn/ui';

import { TxIdWithNotification } from '../../../../../2_molecules/TxIdWithNotification/TransactionIdWithNotification';
import { BITCOIN } from '../../../../../../constants/currencies';
import { useMaintenance } from '../../../../../../hooks/useMaintenance';
import { translations } from '../../../../../../locales/i18n';
import { getRskExplorerUrl } from '../../../../../../utils/helpers';
import { formatValue } from '../../../../../../utils/math';
import { BoltzStatus, BoltzStatusType } from './BoltzStatus';

const translation = translations.boltz.send.confirmationScreens;

const rskExplorerUrl = getRskExplorerUrl();

type ReviewScreenProps = {
  from: string;
  to: string;
  amount: string;
  feesPaid: number;
  receiveAmount: number;
  boltzStatus?: BoltzStatusType;
  onConfirm: () => void;
};

export const ReviewScreen: React.FC<ReviewScreenProps> = ({
  amount,
  onConfirm,
  feesPaid,
  receiveAmount,
  from,
  to,
  boltzStatus,
}) => {
  const { checkMaintenance, States } = useMaintenance();
  const fastBtcLocked = checkMaintenance(States.FASTBTC_SEND);

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
        value: <Icon icon={IconNames.PENDING} />,
      },
      {
        label: t(translation.lightningInvoiceStatus),
        value: <BoltzStatus status={boltzStatus} />,
      },
    ],
    [amount, boltzStatus, from, receiveAmount],
  );

  return (
    <div className="text-center">
      <Heading type={HeadingType.h2} className="font-medium mb-3">
        {t(translation.title)}
      </Heading>

      <Paragraph size={ParagraphSize.small} className="mb-8">
        {t(translation.description)}
      </Paragraph>

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

      <div className="mt-8">
        <Button
          text={t(translations.common.buttons.confirm)}
          onClick={onConfirm}
          disabled={fastBtcLocked}
          className="w-full"
          dataAttribute="funding-send-confirm"
        />
        {fastBtcLocked && (
          <ErrorBadge
            level={ErrorLevel.Warning}
            message={t(translations.maintenanceMode.fastBtc)}
          />
        )}
      </div>
    </div>
  );
};
